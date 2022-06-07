import {
  createSession,
  findSession,
  deleteSession,
} from "../service/session.service";
import { Request, Response } from "express";
import { validateUser } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
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
export async function getUserSessions(req: Request, res: Response) {
  const userID = res.locals.user._id;
  const sessions = await findSession({ user: userID, valid: true });
  res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const result = await deleteSession({ _id: res.locals.user.session });
  console.log("result ", result);
  res.sendStatus(200);
}
