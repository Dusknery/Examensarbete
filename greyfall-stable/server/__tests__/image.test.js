// server/__tests__/image.test.js
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app, connectDB, disconnectDB } from "../app.js";

describe("Image API", () => {
  let mongo;
  let token;

  beforeAll(async () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "password";
    process.env.JWT_SECRET = "test-secret";
    process.env.PORT = "4000";

    mongo = await MongoMemoryServer.create();
    await connectDB(mongo.getUri());

    const loginRes = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "password",
    });

    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;
    expect(token).toBeTruthy();
  });

  afterAll(async () => {
    await disconnectDB();
    if (mongo) await mongo.stop();
  });

  test("POST /api/upload requires auth", async () => {
    const res = await request(app).post("/api/upload");
    expect(res.status).toBe(401);
  });

  test("POST /api/upload requires file", async () => {
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test("POST /api/upload stores file and is reachable via /uploads", async () => {
    const fakePng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);

    const uploadRes = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", fakePng, "test.png");

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.imageUrl).toMatch(/\/uploads\/.+\.png$/);

    const pathname = new URL(uploadRes.body.imageUrl).pathname;
    const getRes = await request(app).get(pathname);

    expect(getRes.status).toBe(200);
    expect(getRes.headers["content-type"]).toMatch(/image/);
  });
});