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
});

