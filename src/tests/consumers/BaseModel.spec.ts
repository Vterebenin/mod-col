import BaseModel from "../../BaseModel";

class Book extends BaseModel {
  public author: string = '';
  public name: string = '';
  public date: string | Date = '';
  public createdAt: string | Date = '';
  public uuid: string = '';

  defaultState() {
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
    this.createdAt = new Date();
    console.log(this, 'there');
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
      // more validations if needed
    };
  }
};


describe('Book model consumer', () => {
  let model: Book;

  test('constructor initializes properties correctly', () => {
    model = new Book();
    console.log(model);
    expect(model.author).toBe('');
    expect(model.name).toBe('');
    expect(model.date).toBe('');
    expect(model.uuid).toBe('');
  });

  test('constructor initializes properties correctly', () => {
    const initialData = {
      author: 'Some Author',
      name: 'Some Name',
      date: new Date(),
      uuid: 'some uuid',
    };
    model = new Book(initialData);
    console.log(model);
    expect(model.author).toBe(initialData.author);
    expect(model.name).toBe(initialData.name);
    expect(model.date).toBe(initialData.date);
    expect(model.uuid).toBe(initialData.uuid);
  });

});

