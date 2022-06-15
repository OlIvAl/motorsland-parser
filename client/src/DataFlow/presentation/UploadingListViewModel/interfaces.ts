export interface IUploadingListViewModel {
  loading: boolean;
  uploadings: string[];
  init(): Promise<void>;
}
