export class HandlerCommand {
  constructor(private handler: Function, private args: any[]) {}

  async execute(): Promise<void> {
    await this.handler(...this.args);
  }
}
