import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { UPLOADING_NAME } from "../constants";
import { getDIContainer } from "../di";

export const GetDocumentListRouter = Router().get(
  "/documents/:uploading",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);

    try {
      const result = await controller.getList(
        req.params.uploading as UPLOADING_NAME
      );

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);
