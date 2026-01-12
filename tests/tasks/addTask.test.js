// tests/tasks/addTask.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../app.js";
import { Task } from "../../models/Task.js";

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  // Lancer MongoMemoryServer
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  // Nettoyer la DB après chaque test
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  // Fermer Mongoose et arrêter le serveur mémoire
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("POST /api/tasks", () => {
  it("should create a task successfully", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Test task",
      duration: "2h",
      description: "This is a test task",
    });

    expect(res.status).toBe(201); // reste 201
    expect(res.body.model.title).toBe("Test task");
  });

  it("should return 422 if request body is invalid", async () => {
    const res = await request(app).post("/api/tasks").send({});
    expect(res.status).toBe(422); // mettre à jour ici
  });
});
