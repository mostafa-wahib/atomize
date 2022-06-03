import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./logger";
import { createClient } from "redis";

export default async () => {
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_END}`
    : ".env";
  config({ path: envFile });
  const dbUri: string = process.env.URI || "mongodb://mongodb:27017/test";
  logger.info(`dburi: ${dbUri} `);
  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to database...");
  } catch (e) {
    logger.fatal("Database connection failed. Exiting...");
    process.exit(1);
  }
};
export const redisConnect = async (): Promise<any | null> => {
  try {
    const client = createClient({
      url: process.env.redisuri || "redis://cache:6379",
    });
    await client.connect();
    logger.info("Connected to cache...");
    return client;
  } catch (err: any) {
    logger.fatal(`Failed to connect to redis server with reason:${err} `);
    return null;
  }
};
