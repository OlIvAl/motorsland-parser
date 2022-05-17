import {
  IDocumentPresentationData,
  IDocumentListViewModel,
} from "./interfaces";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
  IUpdateNewDocumentsCountUseCase,
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
  loadingCount: boolean = false;

  constructor(
    protected model: IDocumentListModel,
    protected getDocumentListUseCase: IGetListUseCase,
    protected createDocumentUseCase: ICreateItemUseCase,
    protected deleteDocumentUseCase: IDeleteItemUseCase,
    protected updateNewDocumentsCountUseCase: IUpdateNewDocumentsCountUseCase
  ) {
    makeObservable<IDocumentListViewModel, "model">(this, {
      list: computed,
      newItemsCount: computed,
      createNewItemProcess: computed,
      loadingList: observable,
      loadingCount: observable,
      model: observable,
      getList: action.bound,
      createItem: action.bound,
      deleteItem: action.bound,
      updateNewItemsCount: action.bound,
    });
  }

  async getList(): Promise<void> {
    this.loadingList = true;

    try {
      const result = await this.getDocumentListUseCase.execute();
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
    this.model = await this.createDocumentUseCase.execute(this.model);
  }

  async deleteItem(id: ID): Promise<void> {
    this.model = await this.deleteDocumentUseCase.execute(id, this.model);
  }

  async updateNewItemsCount(): Promise<void> {
    this.loadingCount = true;

    try {
      this.model = await this.updateNewDocumentsCountUseCase.execute(
        this.model
      );
    } finally {
      runInAction(() => {
        this.loadingCount = false;
      });
    }
  }
}
