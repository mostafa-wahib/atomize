import supertest from "supertest";
import server from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
const app = server();
interface UserData {
  email: string;
  password: string;
  confirmPassword?: string;
  accessToken?: string;
  refreshToken?: string;
}
const user: UserData = {
  email: "melba.hagenes@example.com",
  password: "a54Bedv923W1Oqv",
  confirmPassword: "a54Bedv923W1Oqv",
};
let short: string | null;
describe("url", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await supertest(app).post("/v1/users").send(user);
    await supertest(app)
      .post("/v1/sessions")
      .send({ email: user.email, password: user.password })
      .then((res) => {
        user.accessToken = res.body.accessToken;
        user.accessToken = res.body.accessToken;
      });
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("shorten a url", () => {
    describe("given a valid url", () => {
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
    describe("given a custom short and active session", () => {
      it("should return 200 and the provided custom short", async () => {
        await supertest(app)
          .post("/v1/url/shorten")
          .send({
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            url: "https://google.com",
            short: "custom",
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("short");
          });
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
