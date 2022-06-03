import Url, { UrlData } from "../models/url.model";
import { redisConnect } from "../utils/connect";
import logger from "../utils/logger";
let client: any = null;
(async () => {
  client = await redisConnect();
})();

export async function shortenUrl(urlData: UrlData): Promise<string> {
  const url = new Url(urlData);
  await url.save();
  return url.short;
}

export async function lookup(short: string): Promise<string | null> {
  let url;
  try {
    url = await client.get(short);
  } catch (err: any) {
    logger.error(`Could not get url from cache with reason: ${err} `);
    console.log(err);
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
export async function userUrlLookup(email: string): Promise<UrlData[] | null> {
  const urls = await Url.find({ createdBy: email });
  return urls;
}
