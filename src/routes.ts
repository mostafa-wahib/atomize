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
   * @openv1
   * /v1/healthcheck:
   *  get:
   *   tag:
   *   - Healthcheck
   *   description: Responds if the app is running
   *   responses:
   *    200:
   *      description: server is currently running
   */
  app.get("/v1/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
  );
  userRoutes(app);
  sessionRoutes(app);
  urlRoutes(app);
}

function userRoutes(app: Express) {
  /**
   * @openv1
   * /v1/users:
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
  app.post("/v1/users", registerValidator, emailExists, createUserHandler);
}
function sessionRoutes(app: Express) {
  app.post("/v1/sessions", sessionValidator, createSessionHandler);
  app.get("/v1/sessions", userExists, getUserSessions);
  app.delete("/v1/sessions", userExists, deleteSessionHandler);
}

function urlRoutes(app: Express) {
  app.post("/v1/url/shorten", createUrlValidator, shortenUrlHandler);
  app.get("/:short", lookupUrlValidator, lookupHandler);
}
