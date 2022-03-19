import { createSession } from "../service/session.service";
import { Request, Response } from "express";
import { validateUser } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
require("dotenv").config();
const accessTokenTTL = process.env.ACCESSTOKENTTL || "15m";
const refreshTokenTTL = process.env.REFRESHTOKENTTL || "1y";
export async function createSessionHandler(req: Request, res: Response) {
  const user = await validateUser(req.body.email, req.body.password);
  if (!user) return res.sendStatus(401);
  const session = await createSession(user._id, req.get("user-agent") || "");
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: accessTokenTTL }
  );
  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: refreshTokenTTL }
  );
  return res.send({ accessToken, refreshToken });
}
