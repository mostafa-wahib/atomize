import { Request, Response, NextFunction } from "express";
import User, { UserDocument } from "../models/user.model";
export async function emailExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.sendStatus(409);
  next();
}
