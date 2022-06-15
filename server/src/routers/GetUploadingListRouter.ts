import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { getDIContainer } from "../di";

export const GetUploadingListRouter = Router().get(
  "/uploadings",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Uploading);

    try {
      const result = await controller.getList();

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);
