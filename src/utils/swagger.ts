import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Url Shortener API",
      version: "1.0.0",
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
  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });
}
export default swaggerDocs;
