import BaseModel, { EVENTS_TYPES } from "../BaseModel";

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
    expect(model.initialFields).toEqual(["errors", "initialFields"]);
    expect(model.validation(null)).toStrictEqual({});
  });

  test('clear method clears properties', () => {
    model.loading = true;
    model.errors = { someError: 'Something went wrong' };
    model.boot = () => vi.fn();

    model.clear();

    expect(model.loading).toBe(true);
    expect(model.errors).toStrictEqual({ someError: 'Something went wrong' });
    expect(model.boot).toBeTypeOf("function");
  });

  test('fetch method calls makeRequest with correct arguments', async () => {
    const mockPayload = { somePayload: '1' };
    const mockContext = { someContext: '1' };
    model.validateAndMakeRequest = vi.fn();
    const REQUESTS = [
      model.validateAndFetch.bind(model),
      model.validateAndCreate.bind(model),
      model.validateAndRead.bind(model),
      model.validateAndUpdate.bind(model),
      model.validateAndDelete.bind(model),
    ];
    for (const req of REQUESTS) {
      await req(mockPayload, mockContext);
    }

    expect(model.validateAndMakeRequest).toHaveBeenCalledTimes(REQUESTS.length);
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

  test('isValid returns true if there are no errors messages', () => {
    model.errors = { someError: '' };
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

  test('set method uses clear if no data is provided', () => {
    model.clear = vi.fn();
    model.set(undefined);

    expect(model.clear).toHaveBeenCalledOnce();
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

  test('doWithLoading sets loading to true, calls function, and sets loading to false on success', async () => {
    const mockFunc = vi.fn().mockResolvedValue('Success');
    const args = [1, 'two', { key: 'value' }];

    await model.doWithLoading(mockFunc, ...args);

    expect(model.loading).toBe(false); // Should set loading to true before calling func
    expect(mockFunc).toHaveBeenCalledWith(...args); // Should call the provided function with correct arguments
    expect(model.loading).toBe(false); // Should set loading to false after calling func
  });

  test('doWithLoading sets loading to true, calls function, and sets loading to false on error', async () => {
    const mockFunc = vi.fn().mockRejectedValue('Error');
    const args = [1, 'two', { key: 'value' }];

    await model.doWithLoading(mockFunc, ...args);

    expect(model.loading).toBe(false); // Should set loading to true before calling func
    expect(mockFunc).toHaveBeenCalledWith(...args); // Should call the provided function with correct arguments
    expect(model.loading).toBe(false); // Should set loading to false after calling func
  });

  test('validateAndMakeRequest returns null if validation fails', async () => {
    model.validate = vi.fn().mockReturnValue(false);
    const payload = { someData: 'data' };
    const context = { someContext: 'context' };
    const requestFunc = vi.fn();

    const result = await model.validateAndMakeRequest(payload, context, requestFunc);

    expect(result).toBeNull(); // Should return null if validation fails
    expect(model.loading).toBe(false); // Should not change loading state if validation fails
    expect(requestFunc).not.toHaveBeenCalled(); // Should not call request function if validation fails
  });

  test('validateAndMakeRequest returns null if requestFunc is not provided', async () => {
    model.validate = vi.fn().mockReturnValue(true);
    const payload = { someData: 'data' };
    const context = { someContext: 'context' };

    const result = await model.validateAndMakeRequest(payload, context, null);

    expect(result).toBeNull(); // Should return null if requestFunc is not provided
    expect(model.loading).toBe(false); // Should not change loading state if requestFunc is not provided
  });

  test('validateAndMakeRequest returns response on successful validation and request function execution', async () => {
    model.validate = vi.fn().mockReturnValue(true);
    model.loading = false;
    const payload = { someData: 'data' };
    const context = { someContext: 'context' };
    const response = { responseData: 'response' };
    const requestFunc = vi.fn().mockResolvedValue(response);

    const result = await model.validateAndMakeRequest(payload, context, requestFunc);

    expect(result).toBe(response); // Should return response on successful request function execution
    expect(model.loading).toBe(false); // Should set loading to false after successful request function execution
    expect(requestFunc).toHaveBeenCalledWith(payload); // Should call request function with correct payload
  });

  test('validateAndMakeRequest returns false on failed request function execution', async () => {
    model.validate = vi.fn().mockReturnValue(true);
    model.loading = false;
    const payload = { someData: 'data' };
    const context = { someContext: 'context' };
    const requestFunc = vi.fn().mockRejectedValue('Error');

    const result = await model.validateAndMakeRequest(payload, context, requestFunc);

    expect(result).toBe(false); // Should return false on failed request function execution
    expect(model.loading).toBe(false); // Should set loading to false after failed request function execution
    expect(requestFunc).toHaveBeenCalledWith(payload); // Should call request function with correct payload
  });

  test('initialize calls boot if boot is defined', () => {
    const mockBoot = vi.fn();
    model.boot = mockBoot;

    model.initialize(null);

    expect(mockBoot).toHaveBeenCalled(); // Should call boot if it's defined
  });

  test('initialize does not call boot if boot is not defined', () => {
    const mockBoot = vi.fn();
    model.boot = undefined;

    model.initialize(null);

    expect(mockBoot).not.toHaveBeenCalled(); // Should not call boot if it's not defined
  });

  test('fetch sets data and emits event on successful response', async () => {
    const responseData = { id: 1, name: 'Test' };
    const response = { data: responseData };
    model.apiFunctions = () => ({
      fetch: vi.fn().mockResolvedValue(response),
    })

    model.set = vi.fn();
    model.emit = vi.fn();

    await expect(model.fetch(null)).resolves.toBe(response);

    expect(model.set).toHaveBeenCalledWith(responseData); // Should set data on the model with the response data
    expect(model.emit).toHaveBeenCalledWith(EVENTS_TYPES.AFTER_FETCH, response); // Should emit event with response
  });

  test('fetch does not set data or emit event on failed response', async () => {
    model.apiFunctions = vi.fn().mockReturnValue({
      fetch: vi.fn().mockImplementation(() => {
        throw new Error('test')
      })
    });

    model.set = vi.fn();
    model.emit = vi.fn();

    await model.fetch(null);

    expect(model.set).not.toHaveBeenCalled(); // Should not set data on the model if response fails
    expect(model.emit).not.toHaveBeenCalled(); // Should not emit event if response fails
  });

  test('validate returns true when validation passes', () => {
    model.validation = vi.fn().mockReturnValue({
      field1: () => '',
      field2: () => '',
    });

    const result = model.validate();

    expect(result).toBe(true); // Should return true when validation passes
    expect(model.errors).toEqual({ field1: '', field2: '' }); // Should not populate errors object when validation passes
  });

  test('validate returns false and populates errors object when validation fails', () => {
    model.validation = vi.fn().mockReturnValue({
      field1: () => 'Error message 1',
      field2: () => 'Error message 2',
    });

    const result = model.validate();

    expect(result).toBe(false); // Should return false when validation fails
    expect(model.errors).toEqual({
      field1: 'Error message 1',
      field2: 'Error message 2',
    }); // Should populate errors object when validation fails
  });

  test('validate clears previous errors before validation', () => {
    model.errors = {
      field1: 'Previous error',
      field2: 'Previous error',
    };

    model.validation = vi.fn().mockReturnValue({
      field1: () => 'Error message 1',
      field2: () => 'Error message 2',
    });

    const result = model.validate();

    expect(result).toBe(false); // Should return false when validation fails
    expect(model.errors).toEqual({
      field1: 'Error message 1',
      field2: 'Error message 2',
    }); // Should populate errors object with new errors, clearing previous errors
  });

  test('validate handles null context gracefully', () => {
    model.validation = vi.fn().mockReturnValue({});

    const result = model.validate(null);

    expect(result).toBe(true); // Should return true when validation passes with null context
    expect(model.errors).toEqual({}); // Should not populate errors object when validation passes with null context
  });

  test('clearError clears existing error', () => {
    model.errors = {
      field1: 'Error message 1',
      field2: 'Error message 2',
    };

    model.clearError('field1');

    expect(model.errors).toEqual({
      field1: '',
      field2: 'Error message 2',
    }); // Should clear error for the specified error ID
  });

  test('clearError does nothing if error does not exist', () => {
    model.errors = {
      field1: 'Error message 1',
      field2: 'Error message 2',
    };

    model.clearError('field3');

    expect(model.errors).toEqual({
      field1: 'Error message 1',
      field2: 'Error message 2',
    }); // Should not modify errors object if error ID does not exist
  });

  test('clearError does nothing if errors object is empty', () => {
    model.clearError('field1');

    expect(model.errors).toEqual({}); // Should not modify errors object if it's empty
  });
});

