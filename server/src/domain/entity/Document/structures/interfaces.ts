import { ID } from "../../../../interfaces";

export interface IDocument {
  id: ID;
  name: string;
  createdOn: Date;
  publicURL: string;
}
