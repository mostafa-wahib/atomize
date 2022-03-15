import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
const registerValidator = validate(createUserSchema);
export default function (app: Express) {
  app.get("/heartbeat", (req: Request, res: Response) => res.sendStatus(200));
  app.post("/api/users", registerValidator, createUserHandler);
}
