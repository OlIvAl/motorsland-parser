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
import { injected } from "brandi";
import { BUSINESS_MODELS } from "../../config/dataSource";
import { USE_CASE } from "../../config/usecase";

export class DocumentListViewModel implements IDocumentListViewModel {
  get list(): IDocumentPresentationData[] {
    return this.model.list.items.map(
      (item) => new DocumentPresentationData(item)
    );
  }
  get newDocumentsCount(): number {
    return this.model.list.newDocumentsCount;
  }
  get createNewDocumentProcess(): boolean {
    return this.model.list.progress;
  }

  loadingList: boolean = false;
  loadingCount: boolean = false;

  constructor(
    private model: IDocumentListModel,
    private getDocumentListUseCase: IGetListUseCase,
    private createDocumentUseCase: ICreateItemUseCase,
    private deleteDocumentUseCase: IDeleteItemUseCase
  ) {
    makeObservable<IDocumentListViewModel, "model">(this, {
      list: computed,
      newDocumentsCount: computed,
      createNewDocumentProcess: computed,
      loadingList: observable,
      loadingCount: observable,
      model: observable,
      getList: action.bound,
      createItem: action.bound,
      deleteItem: action.bound,
    });
  }

  async getList(category: string): Promise<void> {
    this.loadingList = true;

    try {
      const result = await this.getDocumentListUseCase.execute(category);
      runInAction(() => {
        this.model.setList(result.list);
      });
    } finally {
      runInAction(() => {
        this.loadingList = false;
      });
    }
  }

  async createItem(category: string): Promise<void> {
    this.model = await this.createDocumentUseCase.execute(this.model, category);
  }

  async deleteItem(id: ID, category: string): Promise<void> {
    this.loadingList = true;

    try {
      const result = await this.deleteDocumentUseCase.execute(
        this.model,
        id,
        category
      );

      runInAction(() => {
        this.model = result;
      });
    } finally {
      runInAction(() => {
        this.loadingList = false;
      });
    }
  }
}

injected(
  DocumentListViewModel,
  BUSINESS_MODELS.DocumentList,
  USE_CASE.GetDocumentList,
  USE_CASE.CreateDocument,
  USE_CASE.DeleteDocument
);
