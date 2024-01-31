import BaseCollection from '../../BaseCollection';
import { Book } from './BaseModel.spec';

export default class BookShelf extends BaseCollection<Book> {
  // redefine this one according to your model of collection
  public model() {
    return Book;
  }

  // some other properties
}

describe('BookShelf collection consumer', () => {
  test('constructor initializes properties correctly', () => {
    const models = [new Book(), new Book()];
    const collection = new BookShelf(models);
    expect(collection.models.length).toBe(models.length);
  });


  // todo: create many more use cases
});


