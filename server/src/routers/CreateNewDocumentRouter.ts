import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { getDIContainer } from "../di";

export const CreateNewDocumentRouter = Router().post(
  "/documents",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);

    try {
      const result = await controller.create();

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
