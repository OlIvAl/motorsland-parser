import { injected } from "brandi";
import { CreateDocumentUseCase } from "../Document/CreateDocumentUseCase";
import { ICreateItemUseCase } from "../Document/interfaces";
import { REPOSITORY } from "../../../di/repository";
import { IDocument } from "../../entity/Document/structures/interfaces";

const fields = {
  vendor_code: "Артикул",
  mark: "Марка",
  model: "Модель",
  auto: "Автомобиль",
  constr_number: "Констр.номер",
  year: "Год",
  engine_type: "Тип двигателя",
  engine_mark: "Маркировка двигателя",
  weight: "Габариты , вес",
  kpp: "КПП",
  vin: "VIN",
};

export class CreateTransmissionUseCase
  extends CreateDocumentUseCase
  implements ICreateItemUseCase
{
  async execute(): Promise<IDocument> {
    return super.execute(fields);
  }
}

injected(CreateTransmissionUseCase, REPOSITORY.Transmission);
