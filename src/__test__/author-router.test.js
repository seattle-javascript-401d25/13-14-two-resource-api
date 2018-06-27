'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Author from '../model/author';
import createMockAuthorPromise from './lib/authorMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/read/author`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => Author.remove());

describe('POST /api/read/author', () => {
  const mockResource = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  test('200 POST for successful post of a author', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.firstName).toEqual(mockResource.firstName);
        expect(response.body.lastName).toEqual(mockResource.lastName);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('GET /api/read/author/:id', () => {
  test('200 GET for successful fetching of an author', () => {
    let returnedAuthor;
    return createMockAuthorPromise()
      .then((newAuthor) => {
        returnedAuthor = newAuthor;
        return superagent.get(`${apiUrl}/${newAuthor._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.firstName).toEqual(returnedAuthor.firstName);
        expect(response.body.lastName).toEqual(returnedAuthor.lastName);
      })
      .catch((err) => {
        throw err;
      });
  });
});
