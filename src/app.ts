import express from "express";
import logger from "./utils/logger";
import connect from "./utils/connect";
import { config } from "dotenv";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";

config();
const app = express();
const port: number = +(process.env.PORT || "1337");
app.use(express.json());
app.use(deserializeUser);

routes(app);
app.listen(port, () => {
  connect();
  logger.info(`Listening on port ${port} `);
});
