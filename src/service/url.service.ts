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
export async function userUrlLookup(email: string): Promise<UrlData[] | null> {
  const urls = await Url.find({ createdBy: email });
  return urls;
}
