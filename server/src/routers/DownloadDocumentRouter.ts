import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { getDIContainer } from "../di";

export const DownloadDocumentRouter = Router().get(
  "/download/:filename",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);

    try {
      const document = await controller.getXMLDocument(
        req.params.filename.replace(".xml", "")
      );
      // const buffer = await API.downloadDocument(req.params.name);

      res.writeHead(200, {
        "Content-Disposition": `attachment; filename=${req.params.filename}`,
        "Content-Type": "application/octet-stream; charset=UTF-8",
      });

      res.end(Buffer.from(document));
    } catch (e) {
      next(e);
    }
  }
);
