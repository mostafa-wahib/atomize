import { connect } from "http2";
import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./logger";
export default async () => {
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_END}`
    : ".env";
  config({ path: envFile });
  const dbUri: string = process.env.URI || "mongodb://localhost:27017/test";
  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to database...");
  } catch (e) {
    logger.fatal("Database connection failed. Exiting...");
    process.exit(1);
  }
};
