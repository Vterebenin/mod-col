import { get, uniqueId } from 'lodash';
import MetaClass from './MetaClass';
import { AbstractObject, Endpoint } from './types';
import { RESERVED_FIELDS } from './const';

export const EVENTS_TYPES = {
  AFTER_FETCH: 'fetch, after',
};

export default class BaseModel extends MetaClass {
  public errors: AbstractObject<String> = {};

  initialFields: string[] = [];

  [key: string]: any;

  constructor(data: any = null) {
    super();
    return this.initialize(data);
  }

  boot(): void {
  }

  initialize(data: any) {
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

  public clear(data = null) {
    this.set(data || this.defaultState());
  }

  public reset(data = null) {
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

  public get isValid() {
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

  public defaultState() {
    return {};
  }

  public clearState() {
    this.loading = false;
    this.errors = {};
    this.set(this.defaultState());
  }

  public get(prop: string, defaultValue: any) {
    return get(this, prop, defaultValue);
  }

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

  public async doWithLoading(func: Function, ...args: any[]) {
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

  public validateAndFetch(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.fetch);
  }

  public validateAndCreate(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.create);
  }

  public validateAndRead(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.read);
  }

  public validateAndUpdate(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.update);
  }

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

  // Validation object is an object that should be written in such way:
  // todo: make docs
  // mapper of validation functions and messages
  public validation(_context: any = null): AbstractObject<() => string> {
    return {};
  }

  public validate(context = null) {
    this.errors = {};
    const validation = this.validation(context);

    let result = true;

    for (const [errorKey, condition] of Object.entries(validation)) {
      if (!condition) return;
      this.errors[errorKey] = '';
      const value = condition();
      if (value) {
        this.errors[errorKey] = value;
        result = false;
      }
    }

    return result;
  }

  public clearError(errorId: string) {
    if (!this.errors[errorId]) return;

    this.errors[errorId] = '';
  }

  public clearErrors(errorIds: string[] = []) {
    const errors = errorIds.length ? errorIds : Object.keys(this.errors);
    errors.forEach(errorId => {
      this.errors[errorId] = '';
    });
  }

  public clone() {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    return clone;
  }
}

