import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { UPLOADING_NAME } from "../constants";
import { getDIContainer } from "../di";

export const CreateNewDocumentRouter = Router().post(
  "/documents/:uploading",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);

    try {
      const result = await controller.create(
        req.params.uploading as UPLOADING_NAME
      );

      res.json(result);
    } catch (e) {
      if ("isHttpError" in (e as any)) {
        res.json(e);
      } else {
        next(e);
      }
    }
  }
);
