import { IDocumentController } from "./interfaces";
import { IDocumentDTO, IDocumentListDTO } from "../domain/repository/Document";
import {
  ICreateDocumentUseCase,
  IDeleteDocumentUseCase,
  IGetDocumentHeadersUseCase,
  IGetDocumentListUseCase,
  IGetDocumentUseCase,
  IUpdateNewDocumentsCountUseCase,
} from "../domain/usecase/Document/interfaces";
import { injected } from "brandi";
import { USE_CASE } from "../di/usecase";
import { UPLOADING_NAME } from "../constants";
import { create } from "xmlbuilder2";
import { writeToString } from "fast-csv";
import { IItemData } from "../dataSources/interfases";

export class DocumentController implements IDocumentController {
  constructor(
    private getDocumentListUseCase: IGetDocumentListUseCase,
    private getDocumentUseCase: IGetDocumentUseCase,
    private createDocumentUseCase: ICreateDocumentUseCase,
    private deleteDocumentUseCase: IDeleteDocumentUseCase,
    private updateNewDocumentsCountUseCase: IUpdateNewDocumentsCountUseCase,
    private getDocumentHeadersUseCase: IGetDocumentHeadersUseCase
  ) {}

  async getList(uploading: UPLOADING_NAME): Promise<IDocumentListDTO> {
    const result = await this.getDocumentListUseCase.execute(uploading);

    return {
      ...result,
      items: result.items.map((item) => this.dateMapper(item)),
    };
  }
  async getXMLDocument(name: UPLOADING_NAME): Promise<string> {
    const result = await this.getDocumentUseCase.execute(name);

    const mapResult = result.map((item) => ({
      ...item,
      images: { image: item.images },
    }));

    const docObj = {
      offers: { offer: mapResult },
    };

    return create(docObj)
      .dec({ encoding: "UTF-8" })
      .end({ prettyPrint: false });
  }
  async getCSVDocument(name: UPLOADING_NAME): Promise<string> {
    const category = (name.match(/^[\w_]+/g) as RegExpMatchArray)[0];
    const headers = await this.getDocumentHeadersUseCase.execute(
      category as UPLOADING_NAME
    );

    const result = await this.getDocumentUseCase.execute(name);

    type CSVItem = Omit<IItemData, "images"> & { images: string };

    const mapResult = result.map<CSVItem>((item) => ({
      ...item,
      images: item.images.join(","),
    }));

    const transform = (row: CSVItem) =>
      Object.keys(row).reduce<Record<string, string>>(
        (transRow, key) => ({
          ...transRow,
          [headers[key]]: row[key],
        }),
        {}
      );

    return await writeToString(mapResult, {
      headers: Object.values(headers),
      transform,
      delimiter: ";",
      alwaysWriteHeaders: true,
    });
  }
  async create(uploading: UPLOADING_NAME): Promise<IDocumentDTO> {
    const result = await this.createDocumentUseCase.execute(uploading);
    return this.dateMapper(result);
  }
  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    return await this.deleteDocumentUseCase.execute(uploading, name);
  }
  async updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    return await this.updateNewDocumentsCountUseCase.execute(uploading);
  }

  protected dateMapper(obj: any): any {
    return {
      ...obj,
      createdOn: obj.createdOn.toISOString(),
    };
  }
}

injected(
  DocumentController,
  USE_CASE.GetDocumentList,
  USE_CASE.GetDocument,
  USE_CASE.CreateDocument,
  USE_CASE.DeleteDocument,
  USE_CASE.UpdateNewDocumentsCount,
  USE_CASE.GetDocumentHeaders
);
