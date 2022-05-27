import express, { Request, Response, Router } from "express";
import { UPLOADING_NAME } from "./constants";
import { Container } from "brandi";
import { CONTROLLER } from "./di/controller";

export function getRouter(
  root: string,
  uploading: UPLOADING_NAME,
  di: Container
): Router {
  const router = express.Router();
  const controller = di.get(CONTROLLER.Document);

  router.get(root, async (req: Request, res: Response, next) => {
    // ToDo: fix bug!!!
    // next(new BadGateway(""));

    try {
      const result = await controller.getList(uploading);

      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post(
    root + "/items/new",
    async (req: Request, res: Response, next) => {
      try {
        const count = await controller.updateNewDocumentsCount(uploading);

        res.json({ count });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(root, async (req: Request, res: Response, next) => {
    try {
      const result = await controller.create(uploading);

      res.json(result);
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
      await controller.delete(uploading, req.params.name);

      res.json({});
    } catch (e) {
      next(e);
    }
  });

  return router;
}
