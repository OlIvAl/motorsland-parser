export class Conveyor<E, R> {
  private arrCounter = 0;
  private elemCounter = 0;
  private matrix: E[][];

  constructor(
    private list: E[],
    private lineCount: number,
    private elementHandler: (elem: E, ...params: any[]) => Promise<R>,
    private params: any[] = []
  ) {
    this.matrix = Conveyor.alterChunk(list, lineCount);
  }

  async handle(): Promise<R[]> {
    const result = await Promise.all(
      this.matrix.map((arr) => {
        this.elemCounter = this.elemCounter + 1;
        const i = this.elemCounter;
        console.log(`Начата обработка ${i} линии`);

        return this.handleSubArr(arr);
      })
    );

    return result.flat();
  }

  private async handleSubArr(arr: E[]): Promise<R[]> {
    const resultArr: R[] = [];

    for (const elem of arr) {
      this.arrCounter = this.arrCounter + 1;
      const i = this.arrCounter;

      if (i % 100 === 0) {
        console.log(
          `${new Date().toLocaleDateString("ru", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })} Начата обработка ${i} элемента`
        );
      }

      const result = await this.elementHandler(elem, ...this.params);
      resultArr.push(result);

      if (i % 100 === 0) {
        console.log(
          `${new Date().toLocaleDateString("ru", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })} Закончена обработка ${i} элемента`
        );
      }
    }

    return resultArr;
    /*return arr.map(async (elem) => {
        console.log(`Начата обработка ${++this.arrCounter} элемента`);

        return await this.elementHandler(elem, ...this.params);
    });*/
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
