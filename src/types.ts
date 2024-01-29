export interface AbstractObject<T> {
  [key: string]: T | null | undefined
}
export type Listeners = AbstractObject<Function[]>

export type Endpoint = ((...args: any) => Promise<any>) | null | undefined;

export interface Endpoints {
  fetch?: Endpoint,
  create?: Endpoint,
  read?: Endpoint,
  update?: Endpoint,
  delete?: Endpoint,
  bulkDelete?: Endpoint,
  bulkCreateOrUpdate?: Endpoint,
  [key: string]: Endpoint,
}
