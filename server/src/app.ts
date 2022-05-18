import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { getRouter } from "./getRouter";
import { getDIContainer } from "./di";
import { CONTROLLER } from "./di/controller";

const app: Express = express()
  .set("port", process.env.PORT || 3001)
  .use(express.json())
  .use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});

const di = getDIContainer();

const enginesRouter = getRouter("/engines", di.get(CONTROLLER.Engine));

const transmissionsRouter = getRouter(
  "/transmissions",
  di.get(CONTROLLER.Transmission)
);

app.use(enginesRouter).use(transmissionsRouter);

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
