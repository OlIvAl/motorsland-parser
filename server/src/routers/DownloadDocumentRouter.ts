import { Request, Response, Router } from "express";
import { CONTROLLER } from "../di/controller";
import { getDIContainer } from "../di";
import { finished, Writable } from "stream";
import { getLocalTime } from "../libs/getLocalTime";

export const DownloadDocumentRouter = Router().get(
  "/download/:filename",
  async (req: Request, res: Response, next) => {
    const di = getDIContainer();
    const controller = di.get(CONTROLLER.Document);
    let stream: Writable;

    try {
      const extension = (
        req.params.filename.match(/\w+$/g) as RegExpMatchArray
      )[0];

      switch (extension) {
        /*case "xml":
          document = await controller.getXMLDocument(
            req.params.filename.replace(".xml", "")
          );
          break;*/
        case "csv":
          stream = await controller.getCSVDocument(req.params.filename, res);
          break;
        default:
          throw new Error("Unknown type!");
      }

      res.writeHead(200, {
        "Content-Disposition": `attachment; filename=${req.params.filename}`,
        "Content-Type": "application/octet-stream; charset=UTF-8",
      });

      finished(res, (err) => {
        if (err) {
          console.error("failed", err);
        } else {
          console.log("Finish:", getLocalTime());
        }
      });
    } catch (e) {
      next(e);
    }
  }
);
