import { Request, Response, Router } from "express";
import { getDIContainer } from "../di";
import { DATA_SOURCE_REMOTE } from "../di/dataSource";

export const MigrationRouter = Router().post(
  "/migration",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const tableClient = di.get(DATA_SOURCE_REMOTE.DocumentTableClient);

    try {
      await tableClient.migrate();

      res.json({ status: "success" });
    } catch (e) {
      next(e);
    }
  }
);
