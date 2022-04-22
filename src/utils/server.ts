import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { deserializeUser } from "../middleware/deserializeUser";
import routes from "../routes";

export default function () {
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_END}`
    : ".env";
  config({ path: envFile });
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(deserializeUser);
  routes(app);
  return app;
}
