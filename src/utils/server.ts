import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { deserializeUser } from "../middleware/deserializeUser";
import routes from "../routes";
import swaggerDocs from "../utils/swagger";
import rateLimit from "express-rate-limit";
export default function () {
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : ".env";
  config({ path: envFile });
  const limiter =
    process.env.LIMITER &&
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 150, // Limit each IP to 150 requests per `window` (here, per 10 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
  const app = express();
  if (limiter) app.use(limiter);
  app.use(cors());
  app.use(express.json());
  app.use(deserializeUser);
  swaggerDocs(app);
  routes(app);
  return app;
}
