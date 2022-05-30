import supertest from "supertest";
import server from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createUser } from "../service/user.service";
const app = server();
const user = {
  email: "melba.hagenes@example.com",
  password: "a54Bedv923W1Oqv",
  passwordConfirmation: "a54Bedv923W1Oqv",
};

describe("user", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("register user route", () => {
    describe("given valid fields", () => {
      it("should return 200", async () => {
        await supertest(app).post("/v1/users").send(user).expect(200);
      });
    });
    describe("given missing fields", () => {
      it("should return 400", async () => {
        await supertest(app).post("/v1/users").send({}).expect(400);
      });
    });
    describe("given email that already exists", () => {
      it("should return 409", async () => {
        await supertest(app).post("/v1/users").send(user).expect(409);
      });
    });
  });
});
