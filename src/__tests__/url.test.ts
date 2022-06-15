import supertest from "supertest";
import server from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
const app = server();
interface UserData {
  email: string;
  password: string;
  passwordConfirmation?: string;
  accessToken?: string;
  refreshToken?: string;
}
const user: UserData = {
  email: "melba.hagenes@example.com",
  password: "a54Bedv923W1Oqv",
  passwordConfirmation: "a54Bedv923W1Oqv",
};
let short: string | null;
describe("url", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await supertest(app).post("/v1/users").send(user).expect(200);
    await supertest(app)
      .post("/v1/sessions")
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
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
    describe("given a custom short and an active session", () => {
      it("should return 200 and the provided custom short", async () => {
        await supertest(app)
          .post("/v1/url/shorten")
          .set({
            Authorization: `Bearer ${user.accessToken}`,
            "x-refresh": user.refreshToken,
          })
          .send({
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            url: "https://google.com",
            short: "custom",
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("short");
            expect(res.body.short).toEqual("custom");
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
    describe("all urls shortened by owner of current session", () => {
      it("should return 200 and a list of urls", async () => {
        await supertest(app)
          .get(`/v1/urls`)
          .set({
            Authorization: `Bearer ${user.accessToken}`,
            "x-refresh": user.refreshToken,
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("urls");
          });
      });
    });
  });
});
