import { get } from "lodash";
import Url, { UrlData } from "../models/url.model";

export async function shortenUrl(urlData: UrlData): Promise<string> {
  const url = new Url(urlData);
  await url.save();
  return url.short;
}

export async function lookup(short: string): Promise<string | null> {
  const url = await Url.findOne({ short });
  return get(url, "original", null);
}
