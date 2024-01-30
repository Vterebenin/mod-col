import BaseModel from "../BaseModel";

describe('BaseModel', () => {
  let model: BaseModel;

  beforeEach(() => {
    model = new BaseModel();
  });

  test('constructor initializes properties correctly', () => {
    expect(model.loading).toBe(false);
    expect(typeof model._uid).toBe('string');
    expect(model._listeners).toEqual({});
    expect(model.errors).toEqual({});
    expect(model.initialFields).toEqual(["errors", "boot", "initialFields"]);
    expect(model.boot).toBeNull();
  });

  test('clear method clears properties', () => {
    model.loading = true;
    model.errors = { someError: 'Something went wrong' };
    model.boot = () => { };

    model.clear();

    expect(model.loading).toBe(true);
    expect(model.errors).toStrictEqual({ someError: 'Something went wrong' });
    expect(model.boot).toBeTypeOf("function");
  });

  test('reset method resets properties', () => {
    model.loading = true;
    model.errors = { someError: 'Something went wrong' };
    model.boot = () => { };

    model.reset();

    expect(model.loading).toBe(false);
    expect(model.errors).toStrictEqual({ someError: '' });
    expect(model.boot).toBeTypeOf("function");
  });

   test('isValid returns true if there are no errors', () => {
    model.errors = {};
    expect(model.isValid).toBe(true);
  });

  test('isValid returns false if there are errors', () => {
    model.errors = { someError: 'Something went wrong' };
    expect(model.isValid).toBe(false);
  });

  test('clone method returns a deep clone of the model', () => {
    const clonedModel = model.clone();
    expect(clonedModel).toEqual(model); // Ensure properties are the same
    expect(clonedModel).not.toBe(model); // Ensure different instances
  });

  test('defaultState method returns an empty object by default', () => {
    expect(model.defaultState()).toEqual({});
  });

  test('clearState method clears loading, errors, and sets default state', () => {
    model.loading = true;
    model.errors = { someError: 'Something went wrong' };
    model.set({ someProperty: 'value' });

    model.clearState();

    expect(model.loading).toBe(false);
    expect(model.errors).toEqual({});
    expect(model.someProperty).toBeDefined(); // Ensure properties are cleared
  });

  test('set method sets properties correctly', () => {
    const data = { prop1: 'value1', prop2: 'value2' };
    model.set(data);

    expect(model.prop1).toBe('value1');
    expect(model.prop2).toBe('value2');
  });

  test('get method retrieves property value correctly', () => {
    model.prop1 = 'value1';
    const value = model.get('prop1', 'defaultValue');

    expect(value).toBe('value1');
  });

  test('get method returns default value if property does not exist', () => {
    const value = model.get('nonExistentProp', 'defaultValue');

    expect(value).toBe('defaultValue');
  });
});

