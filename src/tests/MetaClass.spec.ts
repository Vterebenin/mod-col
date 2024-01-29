import MetaClass from "../MetaClass"

describe('MetaClass', () => {
  let meta: MetaClass;

  beforeEach(() => {
    meta = new MetaClass();
  });

  test('constructor initializes properties correctly', () => {
    expect(meta.loading).toBe(false);
    expect(meta._uid).toBe("2");
    expect(meta._listeners).toEqual({});
  });

  test('updateMeta method resets properties', () => {
    meta.loading = true;
    meta._listeners = { test: [() => {}] };

    meta.updateMeta();

    expect(meta.loading).toBe(false);
    expect(meta._uid).toBe("5");
    expect(meta._listeners).toEqual({});
  });
});

