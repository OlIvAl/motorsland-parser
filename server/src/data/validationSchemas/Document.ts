import { array, boolean, date, number, object, Schema, string } from "yup";
import { IDocument } from "../../domain/entity/Document/structures/interfaces";
import { IDocumentList } from "../../domain/entity/List/stuctures/interfaces";

export const DocumentSchema: Schema<IDocument> = object({
  id: string().defined(),
  name: string().defined(),
  createdOn: date().defined(),
  publicURL: string().url().defined(),
})
  .noUnknown()
  .transform((value: any) => ({
    ...value,
    id: value.name,
  }))
  .defined();

export const ItemsListSchema: Schema<IDocument[]> = array()
  .of(DocumentSchema)
  .defined();
