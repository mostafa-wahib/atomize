import { Express, Request, Response } from "express";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessions,
} from "./controller/session.controller";
import { lookupHandler, shortenUrlHandler } from "./controller/url.controller";
import { createUserHandler } from "./controller/user.controller";
import { userExists } from "./middleware/userExists";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUrlSchema, lookupUrlSchema } from "./schema/url.schema";
import { createUserSchema } from "./schema/user.schema";
import { emailExists } from "./middleware/emailExists";
const registerValidator = validate(createUserSchema);
const sessionValidator = validate(createSessionSchema);
const createUrlValidator = validate(createUrlSchema);
const lookupUrlValidator = validate(lookupUrlSchema);
export default function (app: Express) {
  /**
   * @openapi
   * /heartbeat:
   *  get:
   *   tag:
   *   - Healthcheck
   *   description: Responds if the app is running
   *   responses:
   *    200:
   *      description: API is currently running
   */
  app.get("/heartbeat", (req: Request, res: Response) => res.sendStatus(200));
  userRoutes(app);
  sessionRoutes(app);
  urlRoutes(app);
}

function userRoutes(app: Express) {
  /**
   * @openapi
   * /api/users:
   *  post:
   *   tag:
   *    - Users
   *   summary: Registers a user
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/CreateUserInput'
   *   responses:
   *    200:
   *     description: Success
   *    409:
   *     description: User already exists
   *    400:
   *     description: Bad request
   */
  app.post("/api/users", registerValidator, emailExists, createUserHandler);
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
