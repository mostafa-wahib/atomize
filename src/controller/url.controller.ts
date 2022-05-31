import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { lookup, shortenUrl, userUrlLookup } from "../service/url.service";
import { ConflictError } from "../models/url.model";
export async function shortenUrlHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email = get(res, "locals.user.email", null);
  const customShort = email && req.body.short ? req.body.short : null;
  let urlData = {
    original: req.body.url,
    createdBy: email || null,
    ...(customShort ? { short: customShort } : {}),
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
  res.redirect(original);
}
export async function userUrlLookupHandler(req: Request, res: Response) {
  const email = get(res, "locals.user.email", null);
  try {
    const urls = await userUrlLookup(email);
    res.status(200).json(urls);
  } catch (err: any) {
    logger.error("Failed to retrieve urls for user: ", email);
    res.sendStatus(422);
  }
}
