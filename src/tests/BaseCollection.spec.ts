import BaseCollection from "../BaseCollection";
import BaseModel from "../BaseModel";

describe('BaseCollection', () => {
  let collection: BaseCollection<BaseModel>; // Adjust 'any' as per your BaseModel type

  beforeEach(() => {
    collection = new BaseCollection();
  });

  test('constructor initializes properties correctly', () => {
    expect(collection.loading).toBe(false);
    expect(collection.models).toEqual([]);
  });

  test('transformModels method returns input data', () => {
    const data: never[] = [];
    expect(collection.transformModels(data)).toEqual(data);
  });

  test('createModel method creates a new model with given attributes', () => {
    const attributes = {/* your test attributes here */ };
    const model = collection.createModel(attributes);
    expect(model).toBeDefined();
  });

  test('add method adds a model or item to the collection', () => {
    const model = {/* mock model */ };
    collection.add(model);
    expect(collection.models.length).toBe(1);
    expect(collection.models[0]).toBeInstanceOf(BaseModel);
  });

  test('dropModels method clears models array', () => {
    collection.models = [/* some mock models */];
    collection.dropModels();
    expect(collection.models).toHaveLength(0);
  });

  test('set method replaces models with new data', () => {
    const newData: never[] = [];
    collection.set(newData);
    expect(collection.models).toEqual(newData);
  });

  test('remove method removes the specified model from the collection', () => {
    const mockModel = {/* mock model */ };
    collection.add(mockModel);
    expect(collection.models).toHaveLength(1);
    const modelToRemove = collection.models[0];
    collection.remove(modelToRemove);
    expect(collection.models).toHaveLength(0);
  });

  test('override method replaces the specified model with a new one', () => {
    collection.add({});
    const newModel = collection.models[0].clone();
    newModel.newField = 'i am a new field';
    expect(collection.models[0].newField).not.toBe(newModel.newField);
    collection.override(newModel);
    expect(collection.models[0].newField).toBe(newModel.newField);
  });

  test('get method returns the models array', () => {
    expect(collection.get()).toEqual([]);
  });
});

