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
  describe("login", () => {
    describe("given valid credentials", () => {
      it("should return 200 with an access and refresh token", async () => {
        await supertest(app)
          .post("/v1/sessions")
          .send({ email: user.email, password: user.password })
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("accessToken");
            expect(res.body).toHaveProperty("refreshToken");
          });
      });
    });
  });
});
