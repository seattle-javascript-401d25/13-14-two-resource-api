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
      console.log('++++ 1 ++++ bookMock Saving', JSON.stringify(mockBook, null, 2));
      return new Book(mockBook).save();
    })
    .then((newBook) => {
      mockData.book = newBook;
      console.log('+++++++ 2 +++++ bookMock mockData:', JSON.stringify(mockData, null, 2));
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};
