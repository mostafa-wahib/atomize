import supertest from "supertest";
import server from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
const app = server();
const user = {
  email: "melba.hagenes@example.com",
  password: "a54Bedv923W1Oqv",
  confirmPassword: "a54Bedv923W1Oqv",
};
let short: string | null;

describe("url", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("shorten a url", () => {
    describe("given that a valid url", () => {
      it("should return 200 with a shord ID", async () => {
        await supertest(app)
          .post(`/v1/url/shorten`)
          .send({ url: "http://google.com" })
          .then((res) => {
            expect(res.body).toHaveProperty("short");
            short = res.body.short;
          });
      });
    });
    describe("given an invalid url", () => {
      it("should return 400", async () => {
        await supertest(app)
          .post("/v1/url/shorten")
          .send({ url: "invalidurl" })
          .expect(400);
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
    describe("given a short ID that exists", () => {
      it("should return 301", async () => {
        await supertest(app).get(`/${short}`).expect(302);
      });
    });
  });
});
