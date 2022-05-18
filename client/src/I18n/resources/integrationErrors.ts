import { ErrCodes } from "../../errCodes";

export const ru = {
  errors: {
    [ErrCodes.LESS_THAN_50_ITEMS]:
      "Для создания новой выгрузки должно быть больше 50 элементов",
    [ErrCodes.PROCESS_IS_BUSY]:
      "На настоящий момент сервер занят другим процессом",
  },
};
