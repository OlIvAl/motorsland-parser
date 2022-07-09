import { getLocalTime } from "./getLocalTime";

export class Conveyor<E, R> {
  private arrCounter = 0;
  private matrix: E[][];

  private logNumber = 100;
  private startHandleTime = true;
  private finishHandleTime = true;

  constructor(
    private list: E[],
    private lineCount: number,
    private elementHandler: (elem: E, ...params: any[]) => Promise<R>,
    private params: any[] = []
  ) {
    this.matrix = Conveyor.alterChunk(list, lineCount);
  }

  setLogNumber(logNumber: number): void {
    this.logNumber = logNumber;
  }
  setStartHandleTime(startHandleTime: boolean): void {
    this.startHandleTime = startHandleTime;
  }
  setFinishHandleTime(finishHandleTime: boolean): void {
    this.finishHandleTime = finishHandleTime;
  }

  async handle(): Promise<R[]> {
    console.log(`${getLocalTime()} Начата обработка линий`);

    const result = await Promise.all(
      this.matrix.map((arr) => this.handleSubArr(arr))
    );

    const flatResult = result.flat();

    console.log(`${getLocalTime()} Обработано ${flatResult.length} элементов`);

    return flatResult;
  }

  private async handleSubArr(arr: E[]): Promise<R[]> {
    const resultArr: R[] = [];

    for (const elem of arr) {
      this.arrCounter = this.arrCounter + 1;
      const i = this.arrCounter;

      if (this.startHandleTime && i % this.logNumber === 0) {
        console.log(`${getLocalTime()} Начата обработка ${i} элемента`);
      }

      const result = await this.elementHandler(elem, ...this.params);
      resultArr.push(result);

      if (this.finishHandleTime && i % this.logNumber === 0) {
        console.log(`${getLocalTime()} Закончена обработка ${i} элемента`);
      }
    }

    return resultArr;
  }

  private static chunk<T>(arr: T[], size: number): T[][] {
    const result = [];

    for (let i = 0; i < Math.ceil(arr.length / size); i++) {
      result.push(arr.slice(i * size, i * size + size));
    }

    return result;
  }

  private static alterChunk<T>(arr: T[], size: number): T[][] {
    const realSize = Math.floor(arr.length / size);
    return Conveyor.chunk<T>(arr, realSize);
  }
}
