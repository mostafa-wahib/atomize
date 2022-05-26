import { Request, Response } from "express";
import logger from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    await createUser(req.body);
    res.sendStatus(200);
  } catch (e: any) {
    switch (e.code) {
      case 11000:
        res.sendStatus(409);
        break;
      default:
        logger.error(e.message);
        res.sendStatus(500);
    }
  }
}
