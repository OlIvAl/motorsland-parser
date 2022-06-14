import express, { Express, Request, Response } from "express";
import cors from "cors";
import { getDIContainer } from "./di";
import { UPLOADING_NAME } from "./constants";
import { CONTROLLER } from "./di/controller";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app: Express = express()
  .set("port", process.env.PORT || 3001)
  .use(express.json())
  .use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});

const di = getDIContainer();

app.get("/:uploading", async (req: Request, res: Response, next) => {
  const controller = di.get(CONTROLLER.Document);

  try {
    const result = await controller.getList(
      req.params.uploading as UPLOADING_NAME
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.post("/:uploading/items/new", async (req: Request, res: Response, next) => {
  const controller = di.get(CONTROLLER.Document);

  try {
    const count = await controller.updateNewDocumentsCount(
      req.params.uploading as UPLOADING_NAME
    );

    res.json({ count });
  } catch (e) {
    next(e);
  }
});

app.post("/:uploading", async (req: Request, res: Response, next) => {
  const controller = di.get(CONTROLLER.Document);

  try {
    const result = await controller.create(
      req.params.uploading as UPLOADING_NAME
    );

    res.json(result);
  } catch (e) {
    if ("isHttpError" in (e as any)) {
      res.json(e);
    } else {
      next(e);
    }
  }
});

app.delete("/:uploading/:name", async (req: Request, res: Response, next) => {
  const controller = di.get(CONTROLLER.Document);

  try {
    await controller.delete(
      req.params.uploading as UPLOADING_NAME,
      req.params.name
    );

    res.json({});
  } catch (e) {
    next(e);
  }
});

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
