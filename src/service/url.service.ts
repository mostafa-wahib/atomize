import Url, { UrlData, UrlDocument } from "../models/url.model";
import { redisConnect } from "../utils/connect";
import logger from "../utils/logger";
import { DocumentDefinition } from "mongoose";
import { customAlphabet } from "nanoid";
import { ConflictError } from "../utils/errors";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);
let client: any = null;
(async () => {
  client = await redisConnect();
})();
export async function shortenUrl(urlData: UrlData): Promise<string> {
  const url = new Url(urlData);
  try {
    if (url.custom) {
      await url.save();
      return url.short;
    }
  } catch (err: any) {
    if (err.code === 11000) {
      if (url.custom) throw new ConflictError("Short id already exists");
    }
  }
  while (true) {
    try {
      url.short = nanoid();
      await url.save();
      return url.short;
    } catch (err: any) {
      if (err.code !== 11000) throw new Error("Server error");
      logger.info("Attempting to find unique short...");
    }
  }
}

export async function lookup(short: string): Promise<string | null> {
  let url;
  try {
    url = await client.get(short);
  } catch (err: any) {
    logger.error(`Could not get url from cache with reason: ${err} `);
  }
  if (url) return url;
  url = await Url.findOne({ short });
  if (!url) return null;
  try {
    await client.set(url.short, url.original);
  } catch (err: any) {
    logger.error(`Could not cache url in memory with reason:${err}`);
  }
  return url.original;
}
export async function userUrlLookup(
  email: string
): Promise<DocumentDefinition<UrlDocument>[]> {
  const urls = await Url.find({ createdBy: email });
  return urls;
}
export async function updateReferrer(short: string, referrer: string) {
  try {
    const result = await Url.findOneAndUpdate(
      { short },
      { $inc: { [`referrers.${referrer}`]: 1 } }
    );
    return result?.toObject();
  } catch (err: any) {
    logger.error(`Could not update referrer with error: ${err}`);
  }
}
