import { IDocumentController } from "./interfaces";
import {
  IDocumentDTO,
  IDocumentListDTO,
} from "../domain/repository/Document/interfaces";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../domain/usecase/Document/interfaces";
import { ID } from "../interfaces";

export class DocumentController implements IDocumentController {
  constructor(
    protected getListUseCase: IGetListUseCase,
    protected createItemUseCase: ICreateItemUseCase,
    protected deleteItemUseCase: IDeleteItemUseCase
  ) {}

  async getList(): Promise<IDocumentListDTO> {
    const result = await this.getListUseCase.execute();

    return {
      ...result,
      items: result.items.map((item) => this.dateMapper(item)),
    };
  }
  async create(): Promise<IDocumentDTO> {
    const result = await this.createItemUseCase.execute();
    return this.dateMapper(result);
  }
  async delete(id: ID): Promise<void> {
    return await this.deleteItemUseCase.execute(id);
  }

  protected dateMapper(obj: any): any {
    return {
      ...obj,
      createdOn: obj.createdOn.toISOString(),
    };
  }
}
