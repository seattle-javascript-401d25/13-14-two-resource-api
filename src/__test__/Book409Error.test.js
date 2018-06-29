'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Author from '../model/author';
import Book from '../model/book';
import createMockDataPromise from './lib/bookMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/read/book`;

beforeAll(startServer);
afterAll(stopServer);

describe('POST /api/read/book', () => {
  beforeEach(() => {
    Promise.all([
      Book.remove(),
      Author.remove(),
    ]);
  });

  test('409 POST for trying to create a book with duplicate title', () => {
    return createMockDataPromise()
      .then((mockData) => {
        expect.assertions(1);
        const mockBook = {
          title: mockData.book.title,
          description: faker.lorem.words(15),
          author: mockData.author._id,
        };
        return superagent.post(apiUrl)
          .send(mockBook);
      })
      .then((response) => {
        throw response; // shouldn't get here
      })
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });
});
