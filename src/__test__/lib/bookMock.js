import faker from 'faker';
import Book from '../../model/book';
import authorMockPromise from './authorMock';

export default () => {
  const mockData = {};
  return authorMockPromise()
    .then((newAuthor) => {
      mockData.author = newAuthor;
    })
    .then(() => {
      const mockBook = {
        title: faker.lorem.words(3),
        description: faker.lorem.words(20),
        format: 'paperback',
        author: mockData.author._id,
      };
      return new Book(mockBook).save();
    })
    .then((newBook) => {
      mockData.book = newBook;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};
