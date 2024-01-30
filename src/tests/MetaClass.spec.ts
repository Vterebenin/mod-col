import MetaClass from "../MetaClass"

describe('MetaClass', () => {
  let meta: MetaClass;

  beforeEach(() => {
    meta = new MetaClass();
  });

  test('constructor initializes properties correctly', () => {
    expect(meta.loading).toBe(false);
    expect(typeof meta._uid).toBe('string');
    expect(meta._uid).toBe("2");
    expect(meta._listeners).toEqual({});
  });

  test('createMeta method resets properties', () => {
    meta.loading = true;
    meta._listeners = { test: [() => { }] };

    meta.createMeta();

    expect(meta.loading).toBe(false);
    expect(meta._uid).toBe("5");
    expect(meta._listeners).toEqual({});
  });

  test('fetch method calls makeRequest with correct arguments', async () => {
    const mockPayload = { somePayload: '1' };
    meta.makeRequest = vi.fn();

    await meta.fetch(mockPayload);

    expect(meta.makeRequest).toHaveBeenCalledWith(mockPayload, meta.apiFunctions().fetch);
  });

  test('makeRequest method calls doWithLoading and returns result', async () => {
    const mockFunc = vi.fn().mockResolvedValue('success');
    const result = await meta.makeRequest(null, mockFunc);

    expect(result).toBe('success');
    expect(meta.loading).toBe(false);
  });

  test('emit method calls all listeners for the given event', () => {
    const mockListener1 = vi.fn();
    const mockListener2 = vi.fn();
    meta._listeners['test_event'] = [mockListener1, mockListener2];

    meta.emit('test_event', 'arg1', 'arg2');

    expect(mockListener1).toHaveBeenCalledWith('arg1', 'arg2');
    expect(mockListener2).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('on method adds a listener to the given event', () => {
    const mockListener = vi.fn();
    meta.on('test_event', mockListener);

    expect(meta._listeners['test_event']).toContain(mockListener);
  });
});

