import { IDocumentController } from "./interfaces";
import {
  IDocumentDTO,
  IDocumentListDTO,
} from "../domain/repository/Document/interfaces";
import {
  ICreateDocumentUseCase,
  IDeleteDocumentUseCase,
  IGetDocumentListUseCase,
  IUpdateNewDocumentsCountUseCase,
} from "../domain/usecase/Document/interfaces";
import { ID } from "../interfaces";

export class DocumentController implements IDocumentController {
  constructor(
    protected getDocumentListUseCase: IGetDocumentListUseCase,
    protected createDocumentUseCase: ICreateDocumentUseCase,
    protected deleteDocumentUseCase: IDeleteDocumentUseCase,
    protected updateNewDocumentsCountUseCase: IUpdateNewDocumentsCountUseCase
  ) {}

  async getList(): Promise<IDocumentListDTO> {
    const result = await this.getDocumentListUseCase.execute();

    return {
      ...result,
      items: result.items.map((item) => this.dateMapper(item)),
    };
  }
  async create(): Promise<IDocumentDTO> {
    const result = await this.createDocumentUseCase.execute();
    return this.dateMapper(result);
  }
  async delete(id: ID): Promise<void> {
    return await this.deleteDocumentUseCase.execute(id);
  }
  async updateNewDocumentsCount(): Promise<number> {
    return await this.updateNewDocumentsCountUseCase.execute();
  }

  protected dateMapper(obj: any): any {
    return {
      ...obj,
      createdOn: obj.createdOn.toISOString(),
    };
  }
}
