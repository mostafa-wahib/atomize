import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Url Shortener API",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: {
      bearerAuth: [],
    },
  },
  apis: ["src/routes.ts", "src/schema/*.ts"],
};

const spec = swaggerJsdoc(options);
function swaggerDocs(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });
}
export default swaggerDocs;
