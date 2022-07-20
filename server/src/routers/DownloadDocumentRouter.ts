import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { getDIContainer } from "../di";

export const DownloadDocumentRouter = Router().get(
  "/download/:filename",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);
    let document = "";

    try {
      const extension = (
        req.params.filename.match(/\w+$/g) as RegExpMatchArray
      )[0];

      switch (extension) {
        case "xml":
          document = await controller.getXMLDocument(
            req.params.filename.replace(".xml", "")
          );
          break;
        case "csv":
          document = await controller.getCSVDocument(
            req.params.filename.replace(".csv", "")
          );
          break;
        default:
          throw new Error("Unknown type!");
      }

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
