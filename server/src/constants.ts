import path from "path";

export const WATERMARK_FILE = path.resolve(
  __dirname,
  path.normalize("./static/watermark.png")
);
export const START_TIME = Date.now();
