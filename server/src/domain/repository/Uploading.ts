export interface IUploadingRepository {
  getUploadingProgress(uploading: string): Promise<boolean>;
  getCommonUploadingProgress(uploading: string): Promise<boolean>;
  getNewDocumentsCount(uploading: string): Promise<number>;
}
