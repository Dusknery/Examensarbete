// server/__tests__/horses.api.test.js
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app, connectDB, disconnectDB } from "../app.js";

describe("Horses API", () => {
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

  test("POST /api/horses creates horse (id auto-generated)", async () => {
    const res = await request(app)
      .post("/api/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Horse",
        sex: "Sto",
        breed: "Okänd ras",
        genetics: "e/e a/a",
        images: {
          headshot: "/images/bd66b190-1eb9-4e87-8a06-d767aafe4860.png",
          card: "/images/0b731974-8d2f-4526-87da-a69441de254a.png",
          stallion: "/images/0b731974-8d2f-4526-87da-a69441de254a.png",
          bodyshot: "/images/0b731974-8d2f-4526-87da-a69441de254a.png",
          pedigree: "/images/0b731974-8d2f-4526-87da-a69441de254a.png",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.name).toBe("Test Horse");
  });

  test("GET /api/horses returns list", async () => {
    const res = await request(app).get("/api/horses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("PATCH /api/horses/:id updates horse", async () => {
    // skapa först en häst
    const created = await request(app)
      .post("/api/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Patch Horse", sex: "Hingst", breed: "Okänd ras" });

    const id = created.body.id;

    const patchRes = await request(app)
      .patch(`/api/horses/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isStud: true });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.isStud).toBe(true);
  });

  test("DELETE /api/horses/:id deletes horse", async () => {
    // skapa först en häst
    const created = await request(app)
      .post("/api/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Delete Horse", sex: "Sto", breed: "Okänd ras" });

    const id = created.body.id;

    const delRes = await request(app)
      .delete(`/api/horses/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.ok).toBe(true);

    const getRes = await request(app).get(`/api/horses/${id}`);
    expect(getRes.status).toBe(404);
  });
});