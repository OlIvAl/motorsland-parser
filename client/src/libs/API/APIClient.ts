// ToDo: test it!!!
import ky from "ky";
import { HttpMethod } from "./enums";
import { IAPIClient } from "./interfaces";

export class APIClient implements IAPIClient {
  private readonly api: typeof ky;

  constructor(prefixUrl: string = "") {
    // Формируем инстанс обертки над fetch, передаем параметры по умолчанию
    this.api = ky.create({
      prefixUrl,
      throwHttpErrors: false,
      timeout: false,
    });
  }

  // Подготавливаем тело запроса, если метод не GET
  private static getJSON<P>(
    method: HttpMethod,
    requestObj: P | null
  ): P | null | undefined {
    return method !== HttpMethod.GET && requestObj ? requestObj : undefined;
  }
  // Подготавливаем get параметры, если метод GET
  private static getSearchParams<P>(
    method: HttpMethod,
    requestObj: P | null
  ): P | null | undefined {
    return method === HttpMethod.GET ? requestObj : undefined;
  }

  private async fetchData<P, R>(
    method: HttpMethod,
    url: string,
    requestObj: P | null = null
  ): Promise<R> {
    const json = APIClient.getJSON<P>(method, requestObj);
    const searchParams: any = APIClient.getSearchParams<P>(method, requestObj);

    // Делаем запрос
    const response = await this.api(url, {
      method,
      json,
      searchParams,
    });

    const result = await response.json();

    return result.body as R;
  }

  async getData<P, R>(url: string, requestObj: P | null = null): Promise<R> {
    return (await this.fetchData<P, R>(HttpMethod.GET, url, requestObj)) as R;
  }
  async postData<P, R>(url: string, requestObj: P | null = null): Promise<R> {
    return await this.fetchData<P, R>(HttpMethod.POST, url, requestObj);
  }
  async deleteData<P, R>(url: string, requestObj: P | null = null): Promise<R> {
    return await this.fetchData<P, R>(HttpMethod.DELETE, url, requestObj);
  }
}
