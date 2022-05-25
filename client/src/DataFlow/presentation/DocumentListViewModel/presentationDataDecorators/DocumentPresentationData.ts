import { IDocumentPresentationData } from "../interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";

export class DocumentPresentationData implements IDocumentPresentationData {
  get id(): ID {
    return this.item.id;
  }
  get name(): string {
    return this.item.name;
  }
  get createdOn(): string {
    return new Date(this.item.createdOn).toLocaleString("ru", {
      hour: "numeric",
      minute: "numeric",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  constructor(private item: IDocument) {}
}
