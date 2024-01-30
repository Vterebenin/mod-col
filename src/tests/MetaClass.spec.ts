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

  test('return correct instance and toString', () => {
    expect(meta.toString()).toEqual(`<MetaClass #7>`);
    expect(meta.$class).toEqual(`MetaClass`);
  })

  test('fetch method calls makeRequest with correct arguments', async () => {
    const mockPayload = { somePayload: '1' };
    meta.makeRequest = vi.fn();
    const REQUESTS = [
      meta.fetch.bind(meta),
      meta.create.bind(meta),
      meta.read.bind(meta),
      meta.update.bind(meta),
      meta.delete.bind(meta),
      meta.bulkDelete.bind(meta),
      meta.bulkCreateOrUpdate.bind(meta),
    ];
    for (const req of REQUESTS) {
      await req(mockPayload);
    }

    expect(meta.makeRequest).toHaveBeenCalledWith(mockPayload, meta.apiFunctions().fetch);
    expect(meta.makeRequest).toHaveBeenCalledTimes(REQUESTS.length);
  });

  test('invalida makeRequest should return null', async () => {
    const mockPayload = { somePayload: '1' };
    const response = await meta.makeRequest(mockPayload, null);

    expect(response).toBe(null);
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

  test('does nothing when no listeners provided', () => {
    meta._listeners['test_event'] = undefined;
    const mockListener = vi.fn();
    meta.on('test_event', mockListener);

    expect(meta._listeners['test_event']).toContain(mockListener);
  });

  test('on method adds a listener to the given event', () => {
    const mockListener = vi.fn();
    meta.on('test_event', mockListener);

    expect(meta._listeners['test_event']).toContain(mockListener);
  });

   test('emit method does nothing if no listeners are registered for the event', () => {
    // Mock event with no registered listeners
    const event = 'test_event';
    const mockListener = vi.fn();
    meta.on('other_event', mockListener);

    // Emit the event with arguments
    meta.emit(event, 'arg1', 'arg2');
    expect(mockListener).not.toBeCalled();
  });
});

