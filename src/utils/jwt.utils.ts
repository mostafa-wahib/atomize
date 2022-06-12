import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  if (!process.env.PRIVATEKEY) throw new Error("Private key is not set");
  return jwt.sign(object, process.env.PRIVATEKEY, {
    ...options,
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  if (!process.env.PUBLICKEY) throw new Error("Public key is not set");
  try {
    const decoded = jwt.verify(token, process.env.PUBLICKEY);
    return { valid: true, expired: false, decoded };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
