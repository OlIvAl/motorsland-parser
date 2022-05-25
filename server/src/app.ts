import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { getRouter } from "./getRouter";
import { getDIContainer } from "./di";
import { UPLOADING_NAME } from "./constants";
import { CONTROLLER } from "./di/controller";

const app: Express = express()
  .set("port", process.env.PORT || 3001)
  .use(express.json())
  .use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});

const di = getDIContainer();

// ToDo: генерация роутинга по выгрузкам
// Например: /documents/:uploading
// И свести все в один роут
// Параметр uploading необходимо валидировать. Иначе, возвращать 404
const enginesRouter = getRouter("/engines", UPLOADING_NAME.ENGINES, di);

const transmissionsRouter = getRouter(
  "/transmissions",
  UPLOADING_NAME.TRANSMISSIONS,
  di
);

app.use(enginesRouter).use(transmissionsRouter);

app.get("/download/:filename", async (req: Request, res: Response, next) => {
  const controller = di.get(CONTROLLER.Document);
  try {
    const document = await controller.getXMLDocument(
      req.params.filename.replace(".xml", "")
    );
    // const buffer = await API.downloadDocument(req.params.name);

    res.writeHead(200, {
      "Content-Disposition": `attachment; filename=${req.params.filename}`,
      "Content-Type": "application/octet-stream; charset=UTF-8",
    });

    res.end(Buffer.from(document));
  } catch (e) {
    next(e);
  }
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
