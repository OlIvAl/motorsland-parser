import express, { Express, Request, Response } from "express";
import cors from "cors";
import { ProductFacade } from "./ProductFacade";
import { CONTAINER_NAME } from "./constants";
import { getRouter } from "./getRouter";

const app: Express = express()
  .set("port", process.env.PORT || 3001)
  .use(express.json())
  .use(cors());

const enginesAPI = new ProductFacade(
  "https://motorlandby.ru/engines/",
  CONTAINER_NAME.ENGINES_CONTAINER_NAME
);
const transmissionAPI = new ProductFacade(
  "https://motorlandby.ru/transmission/",
  CONTAINER_NAME.TRANSMISSIONS_CONTAINER_NAME
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});

const enginesRouter = getRouter(
  "/engines",
  {
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
  },
  enginesAPI
);

const transmissionsRouter = getRouter(
  "/transmissions",
  {
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
  },
  transmissionAPI
);

app.use(enginesRouter).use(transmissionsRouter);

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
