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
afterEach(() => {
  Promise.all([
    Book.remove(),
    Author.remove(),
  ]);
});

describe('POST /api/read/book', () => {
  test('200 POST for succcesful posting of a book', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockBook = {
          title: faker.lorem.words(3),
          description: faker.lorem.words(15),
          author: mockData.author._id,
        };

        return superagent.post(apiUrl)
          .send(mockBook)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual(mockBook.title);
            expect(response.body.description).toEqual(mockBook.description);
            expect(response.body._id).toBeTruthy();
          })
          .catch((err) => {
            throw err;
          });
      });
  });
});

describe('GET /api/read/book/:id', () => {
  test('200 GET for succesful fetching of a book', () => {
    let newBook;
    return createMockDataPromise()
      .then((mockData) => {
        newBook = mockData;
        return superagent.get(`${apiUrl}/${mockData.book._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.title).toEqual(newBook.title);
      })
      .catch((err) => {
        throw err;
      });
  });
});
