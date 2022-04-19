import { verifyJwt } from "../utils/jwt.utils";
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { generateAccessToken } from "../service/session.service";
export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  if (!accessToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  const refreshToken = get(req, "headers.x-refresh");
  if (expired && refreshToken) {
    const newAccessToken = await generateAccessToken(refreshToken);
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      const verifiedAccessToken = verifyJwt(newAccessToken);
      console.log("token ", verifiedAccessToken);
      res.locals.user = verifiedAccessToken.decoded;
    }
  }
  return next();
}
