import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./logger";
import { createClient } from "redis";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
config({ path: envFile });
export default async () => {
  const dbUri: string = process.env.URI || "mongodb://mongodb:27017/test";
  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to database...");
  } catch (e) {
    logger.fatal("Database connection failed. Exiting...");
    process.exit(1);
  }
};
export const redisConnect = async (): Promise<any | null> => {
  const url = process.env.redisuri || "redis://cache:6379";
  try {
    const client = createClient({
      url: url,
    });
    await client.connect();
    logger.info("Connected to redis...");
    return client;
  } catch (err: any) {
    logger.fatal(`Failed to connect to redis server with reason:${err}... `);
  }
};
