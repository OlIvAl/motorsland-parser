import { ID } from "../../../../interfaces";

export interface IUploading {
  id: ID;
  name: string;
  newDocumentsCount: number;
  progress: boolean;
}
