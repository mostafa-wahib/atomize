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
    logger.error(e.message);
    res.sendStatus(409);
  }
}
