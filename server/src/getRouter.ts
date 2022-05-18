import express, { Request, Response, Router } from "express";
import { IDocumentController } from "./presentation/interfaces";

export function getRouter(
  root: string,
  controller: IDocumentController
): Router {
  const router = express.Router();

  router.get(root, async (req: Request, res: Response, next) => {
    // ToDo: fix bug!!!
    // next(new BadGateway(""));
    try {
      const result = await controller.getList();

      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post(
    root + "/items/new",
    async (req: Request, res: Response, next) => {
      try {
        const count = await controller.updateNewDocumentsCount();

        res.json({ count });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(root, async (req: Request, res: Response, next) => {
    try {
      const result = await controller.create();

      res.json({ document: result });
    } catch (e) {
      if ("isHttpError" in (e as any)) {
        res.json(e);
      } else {
        next(e);
      }
    }
  });

  router.delete(root + "/:name", async (req: Request, res: Response, next) => {
    try {
      await controller.delete(req.params.name);

      res.json();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
