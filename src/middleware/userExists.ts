import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
export function userExists(req: Request, res: Response, next: NextFunction) {
  const user = get(res, "locals.user", null);
  if (!user) return res.sendStatus(403);
  next();
}
