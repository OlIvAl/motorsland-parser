import { IProductFacade } from "./interfases";
import express, { Request, Response, Router } from "express";

export function getRouter(
  root: string,
  fields: Record<string, string>,
  api: IProductFacade
): Router {
  const router = express.Router();

  router.get(root, async (req: Request, res: Response) => {
    const [documents, newItemsCount] = await Promise.all([
      api.getDocumentsInfo(),
      api.getNewItemsCount(),
    ]);

    res.json({ items: documents, progress: false, newItemsCount });
  });

  router.post(root, async (req: Request, res: Response) => {
    await api.uploadNewDocument(fields);

    const documents = await api.getDocumentsInfo();

    res.json({ document: documents[0] });
  });

  router.delete(root + "/:name", async (req: Request, res: Response) => {
    await api.deleteDocument(req.params.name);

    res.json();
  });

  return router;
}
