import express, { Request, Response, Router } from "express";
import { IDocumentController } from "./presentation/interfaces";

export function getRouter(
  root: string,
  controller: IDocumentController
): Router {
  const router = express.Router();

  router.get(root, async (req: Request, res: Response) => {
    const result = await controller.getList();

    res.json(result);
  });

  router.post(root, async (req: Request, res: Response) => {
    const result = await controller.create();

    res.json({ document: result });
  });

  router.delete(root + "/:name", async (req: Request, res: Response) => {
    await controller.delete(req.params.name);

    res.json();
  });

  return router;
}
