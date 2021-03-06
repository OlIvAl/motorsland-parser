import { array, boolean, date, number, object, Schema, string } from "yup";
import { IDocument } from "../../domain/entity/Document/structures/interfaces";
import { IDocumentList } from "../../domain/entity/List/stuctures/interfaces";

export const DocumentSchema: Schema<IDocument> = object({
  id: string().defined(),
  name: string().defined(),
  createdOn: date().defined(),
})
  .noUnknown()
  .transform((value) => ({
    ...value,
    id: value.name,
  }))
  .defined();

export const DocumentListSchema: Schema<IDocumentList> = object({
  items: array().of(DocumentSchema).defined(),
  progress: boolean().defined(),
  newDocumentsCount: number().defined(),
})
  .noUnknown()
  .defined();
