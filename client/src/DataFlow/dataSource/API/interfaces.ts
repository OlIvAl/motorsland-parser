/**
 * Модуль для реализации запросов к серверу
 */
export interface IAPIClient {
  getData<P, R>(url: string, requestObj?: P | null): Promise<R>;
  postData<P, R>(url: string, requestObj?: P | null): Promise<R>;
  deleteData<P, R>(url: string, requestObj?: P | null): Promise<R>;
}
