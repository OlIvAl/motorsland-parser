import path from "path";

export const WATERMARK_FILE = path.resolve(
  __dirname,
  path.normalize("./static/watermark.png")
);

export enum CONTAINER_NAME {
  IMAGES_CONTAINER_NAME = "images",
  DOCUMENTS_CONTAINER_NAME = "documents",
}

export enum UPLOADING_NAME {
  ENGINES = "engines",
  TRANSMISSIONS = "transmissions",
}
