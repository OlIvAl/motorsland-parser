import { IImageBuilder } from "./interfases";
import fetch from "cross-fetch";
import Jimp from "jimp";
import { WATERMARK_FILE } from "../constants";

export class ImageBuilder implements IImageBuilder {
  private fileName: string = "";
  private buffer?: Buffer;

  constructor(private imgSrc: string) {
    this.init = this.init.bind(this);
    this.setWatermark = this.setWatermark.bind(this);
    this.getBuffer = this.getBuffer.bind(this);
  }

  private async init(): Promise<void> {
    const response = await fetch(this.imgSrc);
    const arrayBuffer = await response.arrayBuffer();

    const parseUrl = response.url.split("/");

    this.fileName = `${parseUrl[parseUrl.length - 2]}/${
      parseUrl[parseUrl.length - 1]
    }`;
    this.buffer = Buffer.from(arrayBuffer);
  }

  private async setWatermark(): Promise<void> {
    if (!this.buffer) {
      throw Error("Buffer не проинициализирован!");
    }

    try {
      const [image, watermark] = await Promise.all([
        Jimp.read(this.buffer),
        Jimp.read(WATERMARK_FILE),
      ]);

      watermark.resize(watermark.bitmap.width / 2, Jimp.AUTO);

      this.buffer = await image
        .composite(
          watermark,
          image.bitmap.width - watermark.bitmap.width,
          image.bitmap.height - watermark.bitmap.height
        )
        .quality(50)
        .resize(960, Jimp.AUTO)
        .getBufferAsync("image/jpeg");
    } catch (error) {
      throw error;
    }
  }
  async getBuffer(): Promise<[string, Buffer]> {
    await this.init();
    await this.setWatermark();

    if (!this.buffer) {
      throw Error("Buffer не проинициализирован!");
    }

    return [this.fileName, this.buffer];
  }
}
