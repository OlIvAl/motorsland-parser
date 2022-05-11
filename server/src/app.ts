import express, { Express, Request, Response } from "express";
import cors from "cors";
import { ProductFacade } from "./ProductFacade";
import { CONTAINER_NAME } from "./constants";

const app: Express = express();

app.set("port", process.env.PORT || 3001);
app.use(express.json());
app.use(cors());

const API = new ProductFacade(
  "https://motorlandby.ru/engines/",
  CONTAINER_NAME.ENGINES_CONTAINER_NAME
);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});
// Получить документы
app.get("/engines", async (req: Request, res: Response) => {
  const [documents, newItemsCount] = await Promise.all([
    API.getDocumentsInfo(),
    API.getNewItemsCount(),
  ]);

  res.json({ items: documents, progress: false, newItemsCount });
});
// Создать выгрузку
app.post("/engines", async (req: Request, res: Response) => {
  await API.uploadNewDocument();
  const documents = await API.getDocumentsInfo();

  res.json({ documents });
});
// Сформировать публичную ссылку на документ
app.get("/engines/:name/url", async (req: Request, res: Response) => {
  const publicUrl = await API.getDocumentPublicURL(req.params.name);

  res.json({ publicUrl });
});
// Удалить документ
app.delete("/engines/:name", async (req: Request, res: Response) => {
  await API.deleteDocument(req.params.name);
  const documents = await API.getDocumentsInfo();

  res.json({ documents });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
