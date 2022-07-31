import { IDocumentController } from "./interfaces";
import { IDocumentDTO, IDocumentListDTO } from "../domain/repository/Document";
import {
  ICreateDocumentUseCase,
  IDeleteDocumentUseCase,
  IGetDocumentHeadersUseCase,
  IGetDocumentListUseCase,
  IGetDocumentUseCase,
} from "../domain/usecase/Document/interfaces";
import { injected } from "brandi";
import { USE_CASE } from "../di/usecase";
import { UPLOADING_NAME } from "../constants";
import { create } from "xmlbuilder2";
import { format } from "fast-csv";
import { Writable } from "stream";
import { IItemData } from "../dataSources/interfases";

export class DocumentController implements IDocumentController {
  constructor(
    private getDocumentListUseCase: IGetDocumentListUseCase,
    private getDocumentUseCase: IGetDocumentUseCase,
    private createDocumentUseCase: ICreateDocumentUseCase,
    private deleteDocumentUseCase: IDeleteDocumentUseCase,
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
    /*const result = await this.getDocumentUseCase.execute(name);

    const mapResult = result.map((item) => ({
      ...item,
      images: { image: item.images },
    }));

    const docObj = {
      offers: { offer: mapResult },
    };*/

    return create({}).dec({ encoding: "UTF-8" }).end({ prettyPrint: false });
  }
  async getCSVDocument(name: UPLOADING_NAME): Promise<any> {
    type CSVItem = Omit<IItemData, "images"> & { images: string };

    const headers = await this.getDocumentHeadersUseCase.execute();

    const transform = (row: CSVItem) =>
      Object.keys(row).reduce<Record<string, string>>(
        (transRow, key) => ({
          ...transRow,
          [headers[key]]: row[key],
        }),
        {}
      );

    return (await this.getDocumentUseCase.execute(name)).pipe(
      format({
        headers: Object.values(headers),
        transform,
        delimiter: ";",
        alwaysWriteHeaders: true,
      })
    );
  }
  async create(sources: string[] = []): Promise<IDocumentDTO> {
    const result = await this.createDocumentUseCase.execute(sources);
    return this.dateMapper(result);
  }
  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    return await this.deleteDocumentUseCase.execute(uploading, name);
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
  USE_CASE.GetDocumentHeaders
);
