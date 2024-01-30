import { isPlainObject } from 'lodash';
import BaseModel from './BaseModel';
import MetaClass from './MetaClass';

// BaseCollection is basically a wrapper around array of Models
export default class BaseCollection<T extends BaseModel> extends MetaClass {
  public models: T[];
  public loading: boolean = false;

  constructor(data: any = []) {
    super();
    this.loading = false;
    this.models = this.transformModels(data);
    this.add = this.add.bind(this);
  }

  public transformModels(data: T[]) {
    return data;
  }

  // redefine this one according to your model of collection
  public model(): T | typeof BaseModel | null | undefined {
    return BaseModel;
  }

  public createModel(attributes: any): T | undefined {
    const ModelConstructor = this.model() as unknown as new (attributes: any) => T;
    if (!ModelConstructor) return;
    return new ModelConstructor(attributes);
  }

  public dropModels() {
    this.models.splice(0, this.models.length);
  }

  public set(data: any) {
    this.dropModels();
    for (const item of data) {
      this.add(item);
    }
  }

  public add(item: any) {
    if (isPlainObject(item)) {
      this.add(this.createModel(item));
      return;
    }
    this.models.push(item);
  }

  public findIndex(item: T) {
    return this.models.findIndex(value => value._uid === item._uid);
  }

  public remove(item: T) {
    const index = this.findIndex(item);
    if (index >= 0) {
      this.models.splice(index, 1);
    }
  }

  public override(item: T) {
    const index = this.findIndex(item);
    if (index === -1) return;
    this.models.splice(index, 1, this.createModel(item) as T);
  }

  public get() {
    return this.models;
  }
}

