import { uniqueId } from 'lodash';
import { Listeners, Endpoints } from './types';

export default class MetaClass {
  public loading: boolean = false;
  public _uid: string = uniqueId();
  public _listeners: Listeners = {};

  constructor() {
    this.createMeta();
  }

  public createMeta() {
    this.loading = false;
    this._uid = uniqueId();
    this._listeners = {};
  }

  /**
   * @returns {string} The class name of this instance.
   */
  public get $class(): string {
    return (Object.getPrototypeOf(this)).constructor.name;
  }

  public toString(): string {
    return `<${this.$class} #${this._uid}>`;
  }

  public fetch(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.fetch);
  }

  public create(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.create);
  }

  public read(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.read);
  }

  public update(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.update);
  }

  public delete(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.delete);
  }

  public bulkDelete(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.bulkDelete);
  }

  public bulkCreateOrUpdate(payload: any = null): Promise<any> {
    return this.makeRequest(payload, this.apiFunctions()?.bulkCreateOrUpdate);
  }

  public async makeRequest(payload: any, reqFunc: any): Promise<any> {
    if (reqFunc) {
      return this.doWithLoading(reqFunc, payload);
    }
    return null;
  }

  public async doWithLoading(func: Function, ...args: any[]) {
    this.loading = true;
    const result = await func(...args);
    this.loading = false;
    return result;
  }

  // mapper of validation functions and messages
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


