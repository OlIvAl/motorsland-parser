import { IImageBuilder, IWatermarkSettings } from "./interfases";
import fetch from "cross-fetch";
import Jimp from "jimp";
import { WATERMARK_FILE } from "../constants";

export class ImageBuilder implements IImageBuilder {
  private fileName: string = "";
  private buffer?: Buffer;

  constructor(
    private imgSrc: string,
    private watermarkSettings?: IWatermarkSettings
  ) {
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
      let image: Jimp = await Jimp.read(this.buffer);

      if (this.watermarkSettings) {
        image = await ImageBuilder.compositeWatermark(
          image,
          this.watermarkSettings
        );
      }

      this.buffer = await image
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
  private static async compositeWatermark(
    image: Jimp,
    settings: IWatermarkSettings
  ): Promise<Jimp> {
    let watermark: Jimp = await Jimp.read(WATERMARK_FILE);

    watermark.resize(
      watermark.bitmap.width * settings.watermarkScale,
      Jimp.AUTO
    );

    switch (settings.position) {
      case "right top":
        return image.composite(
          watermark,
          image.bitmap.width - watermark.bitmap.width,
          0
        );
      case "right bottom":
        return image.composite(
          watermark,
          image.bitmap.width - watermark.bitmap.width,
          image.bitmap.height - watermark.bitmap.height
        );
      case "left top":
        return image.composite(watermark, 0, 0);
      case "left bottom":
        return image.composite(
          watermark,
          0,
          image.bitmap.height - watermark.bitmap.height
        );
      case "center center":
        return image.composite(
          watermark,
          (image.bitmap.width - watermark.bitmap.width) / 2,
          (image.bitmap.height - watermark.bitmap.height) / 2
        );
      default:
        throw new Error("Unknown position!!!");
    }
  }
}
