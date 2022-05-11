/// <reference types="react-scripts" />
type ID = string | number;
declare namespace NodeJS {
  interface Global {
    document: Document;
    window: Window;
    navigator: Navigator;
    fetch: any;
  }
}
