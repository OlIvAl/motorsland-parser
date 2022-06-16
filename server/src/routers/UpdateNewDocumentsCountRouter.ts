import { Router, Request, Response } from "express";
import { CONTROLLER } from "../di/controller";
import { UPLOADING_NAME } from "../constants";
import { getDIContainer } from "../di";

export const UpdateNewDocumentsCountRouter = Router().post(
  "/documents/:uploading/items/new",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);

    try {
      const count = await controller.updateNewDocumentsCount(
        req.params.uploading as UPLOADING_NAME
      );

      res.json({ count });
    } catch (e) {
      next(e);
    }
  }
);
