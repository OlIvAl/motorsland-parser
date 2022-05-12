import {
  IDocumentPresentationData,
  IDocumentListViewModel,
} from "./interfaces";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../../domain/usecase/Engine/interfaces";
import { IDocumentListModel } from "../../domain/entity/List/models/interfaces";
import { makeAutoObservable, runInAction } from "mobx";
import { DocumentPresentationData } from "./presentationDataDecorators/DocumentPresentationData";
import { injected } from "brandi";
import { BUSINESS_MODELS } from "../../Bootstrap/config/di/dataSource";
import { USE_CASE } from "../../Bootstrap/config/di/usecase";

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
    protected model: IDocumentListModel,
    protected getEngineListUseCase: IGetListUseCase,
    protected createEngineUseCase: ICreateItemUseCase,
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

injected(
  EngineListViewModel,
  BUSINESS_MODELS.EngineList,
  USE_CASE.GetEngineList,
  USE_CASE.CreateEngine,
  USE_CASE.DeleteEngine
);
