import express from "express";
import logger from "./utils/logger";
import connect from "./utils/connect";
import dotenv from "dotenv";
import routes from "./routes";
dotenv.config();
const app = express();
const port: number = +(process.env.PORT || "1337");
app.use(express.json());
routes(app);
app.listen(port, () => {
  connect();
  logger.info(`Listening on port ${port} `);
});
