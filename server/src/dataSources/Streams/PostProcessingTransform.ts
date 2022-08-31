import { IItemData, ITableSource } from "../interfases";
import { Transform, TransformCallback } from "stream";
import { getLocalTime } from "../../libs/getLocalTime";

export class PostProcessingTransform extends Transform {
  #count = 0;

  constructor(
    private sources: Record<
      string,
      Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate">
    >
  ) {
    super({ objectMode: true });

    this.on("data", (chunk) => {
      this.#count = this.#count + 1;

      if (this.#count % 5000 === 0) {
        console.log(getLocalTime(), "Handled:", this.#count);
      }
    });
  }

  _transform(
    chunk: IItemData & { uploading: string },
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    const { source, ...data } = chunk;

    const result = PostProcessingTransform.postProcessingData(
      data,
      this.sources[source].preVendorCode,
      this.sources[source].markup,
      this.sources[source].exchangeRate
    );

    this.push(result);

    done();
  }

  _flush(done: TransformCallback) {
    this.sources = {};
    console.log(getLocalTime(), "Handled:", this.#count);

    done();
  }

  private static postProcessingData(
    item: IItemData,
    preVendorCode: string,
    markup: number,
    exchangeRate: number
  ): IItemData {
    item.price = item.price
      ? Math.ceil(Number(item.price) * exchangeRate).toString()
      : "";
    // item.vendor_code = `${preVendorCode}-${item.vendor_code}`;
    item.condition = "Б/У";
    item.status = "на заказ";
    item.authenticity = "оригинал";

    return item;
  }
}
