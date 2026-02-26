import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app, connectDB, disconnectDB } from "../app.js";

describe("PBI: Testa backend endpoints - Horses", () => {
  let mongo;
  let token;

  beforeAll(async () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "password";
    process.env.JWT_SECRET = "test-secret";

    mongo = await MongoMemoryServer.create();
    await connectDB(mongo.getUri());

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "password" });

    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await disconnectDB();
    if (mongo) await mongo.stop();
  });

  test("GET /api/horses fungerar", async () => {
    const res = await request(app).get("/api/horses");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/horses sparar i databasen", async () => {
    const createRes = await request(app)
      .post("/api/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "PBI Test Horse",
        sex: "Sto",
        breed: "Test Ras",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe("PBI Test Horse");

    const listRes = await request(app).get("/api/horses");
    const names = listRes.body.map(h => h.name);

    expect(names).toContain("PBI Test Horse");
  });

  test("Felaktig request ger 400-status", async () => {
    const res = await request(app)
      .post("/api/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sex: "Sto",
      });

    expect(res.status).toBe(400);
  });
});