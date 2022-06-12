import Session, { SessionDocument } from "../models/session.model";
import { FilterQuery } from "mongoose";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { getUser } from "./user.service";
import { config } from "dotenv";
config();
const accessTokenTTL = process.env.ACCESSTOKENTTL || "15m";
export async function createSession(userID: string, userAgent: string) {
  const session = await Session.create({ user: userID, userAgent });
  return session.toJSON();
}

export async function findSession(query: FilterQuery<SessionDocument>) {
  return await Session.find(query).lean();
}

export async function deleteSession(query: FilterQuery<SessionDocument>) {
  return await Session.updateOne(query, { valid: false });
}
export async function generateAccessToken(refreshToken: string) {
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !get(decoded, "session")) return false;
  const session = await Session.findOne({ _id: get(decoded, "session") });
  if (!session || !session.valid) return false;
  const user = await getUser({ _id: session.user });
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: accessTokenTTL }
  );
  return accessToken;
}
