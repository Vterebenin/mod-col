import { get, uniqueId } from 'lodash';
import MetaClass from './MetaClass';
import { AbstractObject, Endpoint } from './types';

export const EVENTS_TYPES = {
  AFTER_FETCH: 'fetch, after',
};

const RESERVED_FIELDS = ['loading', '_uid', '_listeners'];

export default class BaseModel extends MetaClass {
  errors: AbstractObject<String> = {};
  isReactiveValidation: boolean = false;
  initialFields: string[] = [];
  boot: Function | undefined | null = null;
  [key: string]: any,

  constructor(data = null) {
    super();
    this.initialFields = Object.keys(this).filter(k => !RESERVED_FIELDS.includes(k));
    this.clear(data);
    this._uid = uniqueId();
    if (this.boot) {
      this.boot();
    }
    return new Proxy<BaseModel>(this, {
      set: (target, p: string, value: any) => {
        this.clearError(p);
        target[p] = value;
        return true;
      },
    });
  }

  clear(data = null) {
    this.set(data || this.defaultState());
  }

  reset(data = null) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (!this.initialFields.includes(key)) {
        delete this[key];
      }
    }
    this.updateMeta();
    this.clear(data);
    if (this.boot) {
      this.boot();
    }
  }

  get isValid() {
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

  defaultState() {
    return {};
  }

  clearState() {
    this.loading = false;
    this.errors = {};
    this.set(this.defaultState());
  }

  get(prop: string, defaultValue: any) {
    return get(this, prop, defaultValue);
  }

  set(data: AbstractObject<any>) {
    if (!data) {
      this.clear();
      return this;
    }
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });
    return this;
  }

  async doWithLoading(func: Function, ...args: any[]) {
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

  async validateAndMakeRequest(payload: any, context: any, requestFunc: Endpoint): Promise<any> {
    let response;
    const valid = this.validate(context);
    if (!valid) return;
    if (!requestFunc) return;

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

  validateAndFetch(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.fetch);
  }

  validateAndCreate(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.create);
  }

  validateAndRead(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.read);
  }

  validateAndUpdate(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.update);
  }

  validateAndDelete(payload: any, context: any): Promise<any> {
    return this.validateAndMakeRequest(payload, context, this.delete);
  }

  async fetch(payload: any): Promise<any> {
    const response = await super.fetch(payload);
    this.set(response.data);
    this.emit(EVENTS_TYPES.AFTER_FETCH, response);
    return response;
  }

  // Validation object is an object that should be written in such way:
  // todo: make docs
  // mapper of validation functions and messages
  validation(_context: any | null): AbstractObject<() => string> {
    return {};
  }

  validate(context = null) {
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

  clearError(errorId: string) {
    if (!this.errors[errorId]) return;

    this.errors[errorId] = '';
  }

  clearErrors(errorIds: string[]) {
    errorIds.forEach(errorId => {
      this.errors[errorId] = '';
    });
  }
}

