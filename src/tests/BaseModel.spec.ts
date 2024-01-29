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
    expect(model.isReactiveValidation).toBe(false);
    expect(model.initialFields).toEqual([]);
    expect(model.boot).toBeNull();
  });

  test('clear method clears properties', () => {
    model.loading = true;
    model.errors = { someError: 'Something went wrong' };
    model.isReactiveValidation = true;
    model.initialFields = ['test'];
    model.boot = () => { };

    model.clear();

    expect(model.loading).toBe(false);
    expect(model.errors).toEqual({});
    expect(model.isReactiveValidation).toBe(false);
    expect(model.initialFields).toEqual([]);
    expect(model.boot).toBeNull();
  });

  test('reset method resets properties', () => {
    model.loading = true;
    model.errors = { someError: 'Something went wrong' };
    model.isReactiveValidation = true;
    model.initialFields = ['test'];
    model.boot = () => { };

    model.reset();

    expect(model.loading).toBe(false);
    expect(model.errors).toEqual({});
    expect(model.isReactiveValidation).toBe(false);
    expect(model.initialFields).toEqual([]);
    expect(model.boot).toBeNull();
  });
});

