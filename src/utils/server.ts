import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { deserializeUser } from "../middleware/deserializeUser";
import routes from "../routes";
import swaggerDocs from "../utils/swagger";
export default function () {
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : ".env";
  config({ path: envFile });
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(deserializeUser);
  swaggerDocs(app);
  routes(app);
  return app;
}
