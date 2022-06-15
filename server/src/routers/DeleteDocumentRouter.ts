import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { UPLOADING_NAME } from "../constants";
import { getDIContainer } from "../di";

export const DeleteDocumentRouter = Router().delete(
  "/:uploading/:name",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
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
  }
);
