import { isPlainObject } from 'lodash';
import BaseModel from './BaseModel';
import MetaClass from './MetaClass';

/**
 * Represents a collection of some models that extends from BaseModel instances.
 * BaseCollection is basically a wrapper around array of Models
 * @template T - Type parameter extending BaseModel.
 */
export default class BaseCollection<T extends BaseModel> extends MetaClass {
  /** The array of models in the collection. */
  public models: T[];
  /** Indicates if the collection is currently loading. */
  public loading: boolean = false;

  /**
   * Constructs a new BaseCollection.
   * @param {any[]} data - Initial data for the collection.
   */
  constructor(data: any = []) {
    super();
    this.loading = false;
    this.models = this.transformModels(data);
    this.add = this.add.bind(this);
  }

  /**
   * Transforms the provided data into models.
   * 
   * * @example
   * // A common use case for vue.js where you can redefine it like so
   * transformModels(data: T[]): T[] {
   *   return reactive(data); 
   * }
   *
   * @param {T[]} data - The data to transform.
   * @returns {T[]} - The transformed models.
   */
  public transformModels(data: T[]): T[] {
    return data;
  }

  /**
   * Returns the model type or constructor for the collection.
   * @returns {T | typeof BaseModel | null | undefined} - The model type or constructor.
   */
  public model(): T | typeof BaseModel | null | undefined {
    return BaseModel;
  }

  /**
   * Creates a new model instance with the provided attributes.
   * @param {any} attributes - The attributes for the new model.
   * @returns {T | undefined} - The created model instance, or undefined if model is not defined.
   */
  public createModel(attributes: any): T | undefined {
    const ModelConstructor = this.model() as unknown as new (attributes: any) => T;
    if (!ModelConstructor) return;
    return new ModelConstructor(attributes);
  }

  /**
   * Clears the collection by removing all models.
   */
  public dropModels() {
    this.models.splice(0, this.models.length);
  }

  /**
   * Sets the models in the collection.
   * @param {any} data - The data to set as models.
   */
  public set(data: any) {
    this.dropModels();
    for (const item of data) {
      this.add(item);
    }
  }

  /**
   * Adds a model to the collection.
   * If the provided item is a plain object, it is converted into a model before adding.
   * @param {any} item - The item to add.
   */
  public add(item: any) {
    if (isPlainObject(item)) {
      this.add(this.createModel(item));
      return;
    }
    this.models.push(item);
  }

  /**
   * Finds the index of a model in the collection based on its unique ID (_uid).
   * @param {T} item - The model to find.
   * @returns {number} - The index of the model in the collection, or -1 if not found.
   */
  public findIndex(item: T): number {
    return this.models.findIndex(value => value._uid === item._uid);
  }
  /**
   * Removes a model from the collection.
   * @param {T} item - The model to remove.
   */
  public remove(item: T) {
    const index = this.findIndex(item);
    if (index >= 0) {
      this.models.splice(index, 1);
    }
  }

  /**
   * Overrides a model in the collection with a new model instance.
   * If the model to override is not found, no action is taken.
   * @param {T} item - The new model instance to use for override.
   */
  public override(item: T) {
    const index = this.findIndex(item);
    if (index === -1) return;
    this.models.splice(index, 1, this.createModel(item) as T);
  }

  /**
   * Retrieves the models in the collection.
   * @returns {T[]} - The array of models in the collection.
   */
  public get(): T[] {
    return this.models;
  }
}

