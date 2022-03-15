import { connect } from "http2";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";
export default async () => {
  dotenv.config();
  const dbUri: string = process.env.URI || "mongodb://localhost:27017/test";
  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to database...");
  } catch (e) {
    logger.fatal("Database connection failed. Exiting...");
    process.exit(1);
  }
};
