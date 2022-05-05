import express, { Express, Request, Response } from "express";
import cors from "cors";
import { AppFacade } from "./AppFacade";

const app: Express = express();

app.set("port", process.env.PORT || 3001);
app.use(express.json());
app.use(cors());

const API = new AppFacade("https://motorlandby.ru/engines/");

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});
// Получить документы
app.get("/documents", async (req: Request, res: Response) => {
  const documents = await API.getDocumentsInfo();

  res.json({ documents });
});
// Получить количество новых объявлений
app.get("/items/count", async (req: Request, res: Response) => {
  const newItemsCount = await API.getNewItemsCount();

  res.json({ newItemsCount });
});
// Создать выгрузку
app.post("/documents", async (req: Request, res: Response) => {
  await API.uploadNewDocument();
  const documents = await API.getDocumentsInfo();

  res.json({ documents });
});
// Скачать документ
app.get("/documents/:name", async (req: Request, res: Response) => {
  const buffer = await API.downloadDocument(req.params.name);

  res.writeHead(200, {
    "Content-Disposition": `attachment; filename=${req.params.name}.xml`,
    "Content-Type": "application/octet-stream; charset=UTF-8",
  });

  res.end(buffer);
});
// Сформировать публичную ссылку на документ
app.get("/documents/:name/url", async (req: Request, res: Response) => {
  const publicUrl = await API.getDocumentPublicURL(req.params.name);

  res.json({ publicUrl });
});
// Удалить документ
app.delete("/documents/:name", async (req: Request, res: Response) => {
  await API.deleteDocument(req.params.name);
  const documents = await API.getDocumentsInfo();

  res.json({ documents });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
