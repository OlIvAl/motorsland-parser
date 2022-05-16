import { CreateDocumentUseCase } from "../Document/CreateDocumentUseCase";
import { ICreateItemUseCase } from "../Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";
import { IDocument } from "../../entity/Document/structures/interfaces";

const fields = {
  vendor_code: "Артикул",
  mark: "Марка",
  model: "Модель",
  auto: "Автомобиль",
  year: "Год",
  engine_type: "Тип двигателя",
  engine_mark: "Маркировка двигателя",
  engine_number: "Номер двигателя",
  weight: "Габариты, вес",
  description: "Описание",
  kpp: "КПП",
  vin: "VIN",
};

export class CreateEngineUseCase
  extends CreateDocumentUseCase
  implements ICreateItemUseCase
{
  async execute(): Promise<IDocument> {
    return super.execute(fields);
  }
}

injected(CreateEngineUseCase, REPOSITORY.Engine);
