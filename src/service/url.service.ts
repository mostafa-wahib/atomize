import { get } from "lodash";
import Url, { UrlData } from "../models/url.model";
import logger from "../utils/logger";

export async function shortenUrl(urlData: UrlData): Promise<string> {
  console.log("DATA: ", urlData);
  const url = new Url(urlData);
  await url.save();
  console.log("url short: ", url.short);
  return url.short;
}

export async function lookup(short: string): Promise<string | null> {
  const url = await Url.findOne({ short });
  return get(url, "original", null);
}
