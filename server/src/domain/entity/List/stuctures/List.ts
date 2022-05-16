import { ID } from "../../../../interfaces";
import { IList } from "./interfaces";

export class List<M extends { id: ID }> implements IList<M> {
  items: M[] = [];
}
