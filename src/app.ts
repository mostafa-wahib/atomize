import express from "express";
import logger from "./utils/logger";
import connect from "./utils/connect";
import { config } from "dotenv";
import { deserializeUser } from "./middleware/deserializeUser";
config();
import server from "./utils/server";
const app = server();
const port = +(process.env.PORT || 1337);
app.listen(port, () => {
  connect();
  logger.info(`Listening on port ${port} `);
});
