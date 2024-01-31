import BaseModel from "../../BaseModel";
const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${year}-${month}-${day}`;
}

export class Book extends BaseModel {
  public defaultState() {
    return {
      author: '',
      name: '',
      date: '',
      createdAt: '',
      uuid: '',
    };
  }

  // add some props on boot if needed
  boot() {
    this.createdAt = getDate();
  }

  // add api functions as needed
  apiFunctions() {
    return {
      fetch: vi.fn(),
      create: vi.fn(),
      read: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
  }


  validation() {
    return {
      author: (): string => {
        if (!this.author) {
          return 'Author is required';
        }
        return '';
      },
      name: (): string => {
        if (!this.name) {
          return 'Name is required';
        }
        if (this.name.length > 255) {
          return 'Name is too long';
        }
        return '';
      },
    };
  }
};


describe('Book model consumer', () => {
  let model: Book;

  test('constructor initializes properties correctly', () => {
    model = new Book();
    expect(model.createdAt).toBe(getDate());
    expect(model.author).toBe('');
    expect(model.name).toBe('');
    expect(model.date).toBe('');
    expect(model.uuid).toBe('');
  });

  test('constructor initializes properties correctly if provided', () => {
    const initialData = {
      author: 'Some Author',
      name: 'Some Name',
      date: new Date(),
      uuid: 'some uuid',
    };
    model = new Book(initialData);
    expect(model.author).toBe(initialData.author);
    expect(model.name).toBe(initialData.name);
    expect(model.date).toBe(initialData.date);
    expect(model.uuid).toBe(initialData.uuid);
  });

  test('creates error messages', () => {
    const initialData = {
      // 256 j
      name: 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',
      author: '',
      date: new Date(),
      uuid: 'some uuid',
    };
    model = new Book(initialData);
    expect(model.author).toBe(initialData.author);
    expect(model.name).toBe(initialData.name);
    expect(model.date).toBe(initialData.date);
    expect(model.uuid).toBe(initialData.uuid);
    model.validate();
    expect(model.errors.author).toBe('Author is required');
    expect(model.errors.name).toBe('Name is too long');
  });

  // todo: create many more use cases
});

