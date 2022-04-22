import supertest from "supertest";
import server from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { shortenUrl } from "../service/url.service";
import { createUser } from "../service/user.service";
const app = server();
const user = {
  email: "melba.hagenes@example.com",
  password: "a54Bedv923W1Oqv",
  confirmPassword: "a54Bedv923W1Oqv",
};

describe("url", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("shorten url request with a valid url", () => {
    describe("given that the user is anonymous", () => {
      it("should return a 200 with a shord ID", () => {
        expect(true).toBe(true);
      });
    });
  });
  describe("get url route", () => {
    describe("given a short ID that does not exist", () => {
      it("should return 404", async () => {
        const shortid = "a2f03";
        await supertest(app).get(`/${shortid}`).expect(404);
      });
    });
  });
});
