import { IUploadingListViewModel } from "./interfaces";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { IUploading } from "../../domain/entity/Uploading/structures/interfaces";
import { injected } from "brandi";
import { BUSINESS_MODELS } from "../../config/dataSource";
import { USE_CASE } from "../../config/usecase";
import { IGetUploadingListUseCase } from "../../domain/usecase/Uploading/interfaces";
import { IListModel } from "../../domain/entity/List/models/interfaces";

export class UploadingListViewModel implements IUploadingListViewModel {
  get loading(): boolean {
    return this._loading;
  }

  get uploadings(): string[] {
    return this.model.list.items.map((item) => item.name);
  }

  private _loading = false;

  constructor(
    private model: IListModel<IUploading>,
    private getUploadingListUseCase: IGetUploadingListUseCase
  ) {
    makeObservable<any>(this, {
      loading: computed,
      uploadings: computed,
      model: observable,
      _loading: observable,
      init: action.bound,
    });
  }

  async init(): Promise<void> {
    runInAction(() => {
      this._loading = true;
    });

    try {
      const result = await this.getUploadingListUseCase.execute();

      runInAction(() => {
        this.model.setList(result.list);
      });
    } finally {
      runInAction(() => {
        this._loading = false;
      });
    }
  }
}

injected(
  UploadingListViewModel,
  BUSINESS_MODELS.UploadingList,
  USE_CASE.GetUploadingList
);
