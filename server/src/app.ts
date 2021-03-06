import express, { Express, Request, Response } from "express";
import cors from "cors";
import { GetDocumentListRouter } from "./routers/GetDocumentListRouter";
import { UpdateNewDocumentsCountRouter } from "./routers/UpdateNewDocumentsCountRouter";
import { CreateNewDocumentRouter } from "./routers/CreateNewDocumentRouter";
import { DownloadDocumentRouter } from "./routers/DownloadDocumentRouter";
import { DeleteDocumentRouter } from "./routers/DeleteDocumentRouter";
import { GetUploadingListRouter } from "./routers/GetUploadingListRouter";
import { MigrationRouter } from "./routers/MigrationRouter";

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

app
  .use(GetDocumentListRouter)
  .use(UpdateNewDocumentsCountRouter)
  .use(CreateNewDocumentRouter)
  .use(DeleteDocumentRouter)
  .use(DownloadDocumentRouter)
  .use(MigrationRouter)
  .use(GetUploadingListRouter);

const server = app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});

server.keepAliveTimeout = 65 * 1000;
server.headersTimeout = 70 * 1000;
