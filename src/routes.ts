import { Express, Request, Response } from "express";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessions,
} from "./controller/session.controller";
import { lookupHandler, shortenUrlHandler } from "./controller/url.controller";
import { createUserHandler } from "./controller/user.controller";
import { deserializeUser } from "./middleware/deserializeUser";
import { userExists } from "./middleware/userExists";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUrlSchema, lookupUrlSchema } from "./schema/url.schema";
import { createUserSchema } from "./schema/user.schema";
const registerValidator = validate(createUserSchema);
const sessionValidator = validate(createSessionSchema);
const createUrlValidator = validate(createUrlSchema);
const lookupUrlValidator = validate(lookupUrlSchema);
export default function (app: Express) {
  app.get("/heartbeat", (req: Request, res: Response) => res.sendStatus(200));
  userRoutes(app);
  sessionRoutes(app);
  urlRoutes(app);
}

function userRoutes(app: Express) {
  app.post("/api/users", registerValidator, createUserHandler);
}

function sessionRoutes(app: Express) {
  app.post("/api/sessions", sessionValidator, createSessionHandler);
  app.get("/api/sessions", userExists, getUserSessions);
  app.delete("/api/sessions", userExists, deleteSessionHandler);
}

function urlRoutes(app: Express) {
  app.post("/api/url/shorten", createUrlValidator, shortenUrlHandler);
  app.get("/:short", lookupUrlValidator, lookupHandler);
}
