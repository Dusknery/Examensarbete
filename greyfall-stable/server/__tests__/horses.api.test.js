import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app, connectDB, disconnectDB, Horse } from "../app.js";

let mongo;

beforeAll(async () => {
  // Sätt test-env (så login funkar i test)
  process.env.ADMIN_USERNAME = "cecilia";
  process.env.ADMIN_PASSWORD = "testpass";
  process.env.JWT_SECRET = "testsecret";

  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());
});

afterAll(async () => {
  await disconnectDB();
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  await Horse.deleteMany({});
});

async function loginAndGetToken() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: "cecilia", password: "testpass" });

  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeTruthy();
  return res.body.token;
}

test("GET /api/horses fungerar (200 + array)", async () => {
  const res = await request(app).get("/api/horses");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("POST /api/horses sparar i databasen (201) och syns i GET", async () => {
  const token = await loginAndGetToken();

  const payload = {
    id: "test-001",
    name: "Test Horse",
    breed: "KWPN",
    sex: "Hingst",
    color: "Brun",
    isStud: true,
  };

  const createRes = await request(app)
    .post("/api/horses")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body.id).toBe("test-001");
  expect(createRes.body.name).toBe("Test Horse");

  const listRes = await request(app).get("/api/horses");
  expect(listRes.statusCode).toBe(200);
  expect(listRes.body.some((h) => h.id === "test-001")).toBe(true);
});

test("Felaktig POST /api/horses ger 400", async () => {
  const token = await loginAndGetToken();

  const badRes = await request(app)
    .post("/api/horses")
    .set("Authorization", `Bearer ${token}`)
    .send({ id: "bad-001" }); // saknar name

  expect(badRes.statusCode).toBe(400);
  expect(badRes.body.error).toBeTruthy();
});
