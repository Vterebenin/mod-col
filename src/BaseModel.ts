import { get, uniqueId } from 'lodash';
import MetaClass from './MetaClass';
import { AbstractObject, Endpoint } from './types';
import { RESERVED_FIELDS } from './const';

export const EVENTS_TYPES = {
  AFTER_FETCH: 'fetch, after',
};

/**
 * Represents a base model with common functionality.
 */
export default class BaseModel extends MetaClass {
  /** The errors associated with the model. */
  public errors: AbstractObject<String> = {};

  /** The initial fields of the model. */
  initialFields: string[] = [];

  [key: string]: any;

  /**
   * Constructs a new BaseModel.
   * @param {any} data - Optional data to initialize the model with.
   */
  constructor(data: any = null) {
    super();
    return this.initialize(data);
  }

  /**
   * Boot method to be overridden by subclasses.
   */
  boot(): void {
    // Implement boot logic in subclasses
  }

  /**
   * Initializes the BaseModel with the provided data.
   * @param {any} data - The data to initialize the model with.
   * @returns {BaseModel} - The initialized model.
   */
  initialize(data: any): this {
    this.initialFields = Object.keys(this).filter(k => !RESERVED_FIELDS.includes(k));
    this.clear(data);
    this._uid = uniqueId();
    if (this.boot) {
      this.boot();
    }
    return new Proxy(this, {
      set: (target, p: string, value: any) => {
        this.clearError(p);
        target[p] = value;
        return true;
      },
    });
  }

  /**
   * Clears the model.
   * @param {any} data - Optional data to clear the model with.
   */
  public clear(data: any = null) {
    this.set(data || this.defaultState());
  }

  /**
   * Resets the model.
   * @param {any} data - Optional data to reset the model with.
   */
  public reset(data: any = null) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (!this.initialFields.includes(key)) {
        delete this[key];
      }
    }
    this.clearErrors();
    this.createMeta();
    this.clear(data);
    if (this.boot) {
      this.boot();
    }
  }

  /**
   * Checks if the model is valid.
   * @returns {boolean} - True if the model is valid, false otherwise.
   */
  public get isValid(): boolean {
    if (!Object.keys(this.errors).length) {
      return true;
    }

    for (const value of Object.values(this.errors)) {
      if (value?.length) {
        return false;
      }
    }

    return true;
  }

  /**
   * Default state method to be overridden by subclasses.
   * @returns {any} - The default state for the model.
   */
  public defaultState(): any {
    return {};
  }

  /**
   * Clears the state of the model.
   */
  public clearState() {
    this.loading = false;
    this.errors = {};
    this.set(this.defaultState());
  }

  /**
   * Retrieves a property from the model.
   * @param {string} prop - The property to retrieve.
   * @param {any} defaultValue - The default value if the property is not found.
   * @returns {any} - The value of the property.
   */
  public get(prop: string, defaultValue: any): any {
    return get(this, prop, defaultValue);
  }

  /**
   * Sets data to the model.
   * @param {AbstractObject<any> | undefined} data - The data to set to the model.
   * @returns - The modified model instance.
   */
  public set(data: AbstractObject<any> | undefined) {
    if (!data) {
      this.clear();
      return this;
    }
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });
    return this;
  }

  /**
   * Executes a function with loading indication.
   * @param {Function} func - The function to execute.
   * @param {...any} args - The arguments to pass to the function.
   * @returns {Promise<any>} - A promise resolving to the result of the function or an error.
   */
  public async doWithLoading(func: Function, ...args: any[]): Promise<any> {
    this.loading = true;
    let response;
    try {
      response = await func(...args);
    } catch (e) {
      response = e;
      console.error(e);
    }
    this.loading = false;
    return response;
  }

  /**
   * Validates the model and makes a request if validation passes.
   * @param {any} payload - The payload for the request.
   * @param {any} context - The context for validation.
   * @param {Endpoint} requestFunc - The request function.
   * @returns {Promise<any>} - A promise resolving to the response of the request or false if validation fails.
   */
  public async validateAndMakeRequest(payload: any, context: any, requestFunc: Endpoint): Promise<any> {
    let response;
    const valid = this.validate(context);
    if (!valid) return null;
    if (!requestFunc) return null;

    try {
      response = await requestFunc.call(this, payload);
    } catch (e) {
      this.loading = false;
      return false;
    } finally {
      this.loading = false;
    }
    return response;
  }

  /**
   * Validates and fetches data from the server.
   * @param {any} payload - The payload for the fetch request.
   * @param {any} context - The context for validation.
   * @returns {Promise<any>} - A promise resolving to the fetched data or false if validation fails.
   */
  public validateAndFetch(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.fetch);
  }

  /**
   * Validates and creates data on the server.
   * @param {any} payload - The payload for the create request.
   * @param {any} context - The context for validation.
   * @returns {Promise<any>} - A promise resolving to the created data or false if validation fails.
   */
  public validateAndCreate(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.create);
  }

  /**
   * Validates and reads data from the server.
   * @param {any} payload - The payload for the read request.
   * @param {any} context - The context for validation.
   * @returns {Promise<any>} - A promise resolving to the read data or false if validation fails.
   */
  public validateAndRead(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.read);
  }

  /**
   * Validates and updates data on the server.
   * @param {any} payload - The payload for the update request.
   * @param {any} context - The context for validation.
   * @returns {Promise<any>} - A promise resolving to the updated data or false if validation fails.
   */
  public validateAndUpdate(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.update);
  }

  /**
   * Validates and deletes data on the server.
   * @param {any} payload - The payload for the delete request.
   * @param {any} context - The context for validation.
   * @returns {Promise<any>} - A promise resolving to true if deletion is successful, false otherwise.
   */
  public validateAndDelete(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.delete);
  }

  public async fetch(payload: any): Promise<any> {
    const response = await super.fetch(payload);

    if (response instanceof Error) {
      return response;
    }

    this.set(response.data);
    this.emit(EVENTS_TYPES.AFTER_FETCH, response);
    return response;
  }

  // 
  /**
   * Retrieves the validation object.
   * @example
   * // Validation object is an object that should be written in such way:
   * // validation passes if the property function return empty string
   * // prop is a name of your class properties that should be validated
   * {
   *    prop: () => {
   *        if (someCondition) {
   *          return 'error message';
   *        }
   *        return '';
   *    }
   * }
   * @param {any} _context - The context for validation (unused).
   * @returns {AbstractObject<() => string>} - The validation object mapping validation functions and messages.
   */
  public validation(_context: any = null): AbstractObject<() => string> {
    return {};
  }

  /**
   * Validates the model based on the validation object.
   * @param {any} context - The context for validation.
   * @returns {boolean} - True if the model passes validation, false otherwise.
   */
  public validate(context: any = null): boolean {
    this.errors = {};
    const validation = this.validation(context);

    let result = true;

    for (const [errorKey, condition] of Object.entries(validation)) {
      if (!condition) return false;
      this.errors[errorKey] = '';
      const value = condition();
      if (value) {
        this.errors[errorKey] = value;
        result = false;
      }
    }

    return result;
  }

  /**
   * Clears a specific error in the model's error object.
   * @param {string} errorId - The ID of the error to clear.
   */
  public clearError(errorId: string) {
    if (!this.errors[errorId]) return;

    this.errors[errorId] = '';
  }

  /**
   * Clears multiple errors in the model's error object.
   * @param {string[]} [errorIds=[]] - An array of error IDs to clear. If empty, clears all errors.
   */
  public clearErrors(errorIds: string[] = []) {
    const errors = errorIds.length ? errorIds : Object.keys(this.errors);
    errors.forEach(errorId => {
      this.errors[errorId] = '';
    });
  }

  /**
   * Creates a shallow clone of the model.
   * @returns {BaseModel} - The cloned instance of the model.
   */
  public clone(): this {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    return clone;
  }
}

