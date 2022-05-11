import {
  IDocumentPresentationData,
  IDocumentListViewModel,
} from "./interfaces";
import { inject, injectable } from "tsyringe";
import { USE_CASE } from "../../Bootstrap/config/di/usecase";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../../domain/usecase/Engine/interfaces";
import { DATA_SOURCE_LOCAL } from "../../Bootstrap/config/di/dataSource";
import { IDocumentListModel } from "../../domain/entity/List/models/interfaces";
import { makeAutoObservable, runInAction } from "mobx";
import { DocumentPresentationData } from "./presentationDataDecorators/DocumentPresentationData";

@injectable()
export class EngineListViewModel implements IDocumentListViewModel {
  get list(): IDocumentPresentationData[] {
    return this.model.list.items.map(
      (item) => new DocumentPresentationData(item)
    );
  }
  get newItemsCount(): number {
    return this.model.list.newItemsCount;
  }
  get createNewItemProcess(): boolean {
    return this.model.list.progress;
  }

  loadingList: boolean = false;

  constructor(
    @inject(DATA_SOURCE_LOCAL.EngineList) protected model: IDocumentListModel,
    @inject(USE_CASE.GetEngineList)
    protected getEngineListUseCase: IGetListUseCase,
    @inject(USE_CASE.CreateEngine)
    protected createEngineUseCase: ICreateItemUseCase,
    @inject(USE_CASE.DeleteEngine)
    protected deleteEngineUseCase: IDeleteItemUseCase
  ) {
    makeAutoObservable<IDocumentListViewModel>(this);
  }

  async getList(): Promise<void> {
    this.loadingList = true;

    try {
      await runInAction(async () => {
        this.model = await this.getEngineListUseCase.execute();
      });
    } finally {
      this.loadingList = false;
    }
  }

  async createItem(): Promise<void> {
    this.model = await this.createEngineUseCase.execute(this.model);
  }

  async deleteItem(id: ID): Promise<void> {
    this.model = await this.deleteEngineUseCase.execute(id, this.model);
  }
}
