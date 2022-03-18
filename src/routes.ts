import { Express, Request, Response } from "express";
import { createSessionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
const registerValidator = validate(createUserSchema);
const sessionValidator = validate(createSessionSchema);
export default function (app: Express) {
  app.get("/heartbeat", (req: Request, res: Response) => res.sendStatus(200));
  app.post("/api/users", registerValidator, createUserHandler);
  app.post("/api/sessions", sessionValidator, createSessionHandler);
}
