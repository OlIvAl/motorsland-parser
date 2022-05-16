import {
  IDocumentPresentationData,
  IDocumentListViewModel,
} from "./interfaces";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../../domain/usecase/Document/interfaces";
import { IDocumentListModel } from "../../domain/entity/List/models/interfaces";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { DocumentPresentationData } from "./presentationDataDecorators/DocumentPresentationData";

export abstract class DocumentListViewModel implements IDocumentListViewModel {
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
    makeObservable<IDocumentListViewModel, "model">(this, {
      list: computed,
      newItemsCount: computed,
      createNewItemProcess: computed,
      loadingList: observable,
      model: observable,
      getList: action.bound,
      createItem: action.bound,
      deleteItem: action.bound,
    });
  }

  async getList(): Promise<void> {
    this.loadingList = true;

    try {
      const result = await this.getEngineListUseCase.execute();
      runInAction(() => {
        this.model = result;
      });
    } finally {
      runInAction(() => {
        this.loadingList = false;
      });
    }
  }

  async createItem(): Promise<void> {
    this.model = await this.createEngineUseCase.execute(this.model);
  }

  async deleteItem(id: ID): Promise<void> {
    this.model = await this.deleteEngineUseCase.execute(id, this.model);
  }
}
