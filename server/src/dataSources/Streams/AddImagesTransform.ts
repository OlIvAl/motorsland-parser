import { Transform, TransformCallback } from "stream";
import {
  IAzureBlobStorage,
  IDocumentTableClient,
  IItemData,
} from "../interfases";

export class AddImagesTransform extends Transform {
  #buffer: IItemData[] = [];

  constructor(
    private documentTableClient: IDocumentTableClient,
    private imagesStorage: IAzureBlobStorage
  ) {
    super({ objectMode: true });
  }

  _transform(
    chunk: IItemData,
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    this.#buffer.push(chunk);

    if (this.#buffer.length < 100) {
      done();
    } else {
      this.#transformFn().then(() => done());
    }
  }

  _flush(done: TransformCallback) {
    if (this.#buffer.length > 0) {
      this.#transformFn().then(() => done());
    } else {
      done();
    }
  }

  #transformFn(): Promise<void> {
    const vendorCodes = this.#buffer.map(({ vendor_code }) => vendor_code);

    return this.#getData(vendorCodes).then((srcArr: string[][]) => {
      this.#buffer.map((item, index) => {
        item.images = srcArr[index];
        return item;
      });

      this.#buffer.forEach((item) => {
        this.push(item);
      });

      this.#buffer = [];
    });
  }
  #getData(vendorCodes: string[]): Promise<string[][]> {
    return Promise.all(
      vendorCodes.map<Promise<string[]>>((vendorCode: string) =>
        this.documentTableClient.getImgSrcArr(vendorCode)
      )
    ).then((images: string[][]) =>
      Promise.all(
        images.map((images: string[]) =>
          Promise.all(images.map((src) => this.imagesStorage.getPublicURL(src)))
        )
      )
    );
  }
}
