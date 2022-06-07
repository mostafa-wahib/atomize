import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  lookup,
  shortenUrl,
  updateReferrer,
  userUrlLookup,
} from "../service/url.service";
import { ConflictError } from "../models/url.model";
export async function shortenUrlHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email = get(res, "locals.user.email", null);
  if (req.body.short && !email) return res.sendStatus(403);
  let urlData = {
    original: req.body.url,
    createdBy: email || null,
    custom: false,
    referrers: {},
    ...(req.body.short ? { short: req.body.short, custom: true } : {}),
  };
  try {
    const short = await shortenUrl(urlData);
    res.json({ short });
  } catch (err: any) {
    switch (err.constructor) {
      case ConflictError:
        return res.sendStatus(409);
      default:
        logger.error("Failed to Shorten Url: : ", err.msg);
        res.sendStatus(422);
    }
  }
}
export async function lookupHandler(req: Request, res: Response) {
  const original = await lookup(req.params.short);
  if (!original) return res.sendStatus(404);
  logger.info(`referer: ${req.headers.referer}`);
  if (req.headers.referer)
    updateReferrer(req.params.short, req.headers.referer);
  res.redirect(original);
}
export async function userUrlLookupHandler(req: Request, res: Response) {
  const email = get(res, "locals.user.email", null);
  try {
    const urlDocuments = await userUrlLookup(email);
    const urls = urlDocuments.map((doc) => ({
      short: doc.short,
      original: doc.original,
      referrers: doc.referrers,
    }));

    res.status(200).json({ urls: urls });
  } catch (err: any) {
    logger.error("Failed to retrieve urls for user: ", email);
    res.sendStatus(422);
  }
}
