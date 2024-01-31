import { uniqueId } from 'lodash';
import { Listeners, Endpoints } from './types';

/**
 * Represents a base class with common functionality.
 */
export default class MetaClass {
  /** Indicates whether the class is currently loading. */
  public loading: boolean = false;
  
  /** Unique identifier for the instance. */
  public _uid: string = uniqueId();
  
  /** Event listeners registered for this instance. */
  public _listeners: Listeners = {};

  /** Constructs a new MetaClass instance. */
  constructor() {
    this.createMeta();
  }

  /** Initializes or resets metadata for the instance. */
  public createMeta(): void {
    this.loading = false;
    this._uid = uniqueId();
    this._listeners = {};
  }

  /** Gets the class name of this instance. */
  public get $class(): string {
    return (Object.getPrototypeOf(this)).constructor.name;
  }

  /** Returns a string representation of this instance. */
  public toString(): string {
    return `<${this.$class} #${this._uid}>`;
  }

  /**
   * Initiates a fetch operation using provided payload.
   * @param payload The payload for the fetch operation.
   * @returns A Promise representing the fetch operation.
   */
  public fetch(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.fetch);
  }

  /**
   * Initiates a create operation using provided payload.
   * @param payload The payload for the create operation.
   * @returns A Promise representing the create operation.
   */
  public create(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.create);
  }

  /**
   * Initiates a read operation using provided payload.
   * @param payload The payload for the read operation.
   * @returns A Promise representing the read operation.
   */
  public read(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.read);
  }

  /**
   * Initiates an update operation using provided payload.
   * @param payload The payload for the update operation.
   * @returns A Promise representing the update operation.
   */
  public update(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.update);
  }

  /**
   * Initiates a delete operation using provided payload.
   * @param payload The payload for the delete operation.
   * @returns A Promise representing the delete operation.
   */
  public delete(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.delete);
  }

  /**
   * Initiates a bulk delete operation using provided payload.
   * @param payload The payload for the bulk delete operation.
   * @returns A Promise representing the bulk delete operation.
   */
  public bulkDelete(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.bulkDelete);
  }

  /**
   * Initiates a bulk create or update operation using provided payload.
   * @param payload The payload for the bulk create or update operation.
   * @returns A Promise representing the bulk create or update operation.
   */
  public bulkCreateOrUpdate(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.bulkCreateOrUpdate);
  }

  /**
   * Makes a request using the provided request function and payload.
   * @param payload The payload for the request.
   * @param reqFunc The request function to execute.
   * @returns A Promise representing the request operation.
   */
  public async makeRequest(payload: any, reqFunc: any): Promise<any> {
    if (reqFunc) {
      return this.doWithLoading(reqFunc, payload);
    }
    return null;
  }

  /**
   * Performs an asynchronous operation with loading indicator.
   * @param func The function to execute.
   * @param args Additional arguments for the function.
   * @returns A Promise representing the result of the operation.
   */
  public async doWithLoading(func: Function, ...args: any[]): Promise<any> {
    this.loading = true;
    const result = await func(...args);
    this.loading = false;
    return result;
  }

  /** 
   * Returns a map of API functions with default values.
   * @returns An object containing API functions.
   */
  public apiFunctions(): Endpoints {
    return {
      fetch: null,
      create: null,
      read: null,
      update: null,
      delete: null,
      bulkDelete: null,
      bulkCreateOrUpdate: null,
    };
  }

  /**
   * Emits an event by name to all registered listeners on that event.
   * Listeners will be called in the order that they were added. If a listener
   * returns `false`, no other listeners will be called.
   *
   * @param {string} event    The name of the event to emit.
   * @param {Any} args  The context of the event, passed to listeners.
   */
  public emit(event: any, ...args: any[]): void {
    const listeners = this._listeners[event];

    if (!listeners) {
      return;
    }

    // Run through each listener. If any of them return false, stop the
    // iteration and mark that the event wasn't handled by all listeners.
    listeners.forEach((listener: Function) => listener(...args));
  }

  /**
   * Registers an event listener for a given event.
   *
   * Event names can be comma-separated to register multiple events.
   *
   * @param {string}   event      The name of the event to listen for.
   * @param {function} listener   The event listener, accepts context.
   */
  public on(event: string, listener: Function): void {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event]!.push(listener);
  }
}


