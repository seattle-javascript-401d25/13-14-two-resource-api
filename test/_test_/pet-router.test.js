'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Owner from '../model/owner';
import Pet from '../model/pet';
import createMockDataPromise from './lib/petMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/pets`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => {
  Promise.all([
    Owner.remove({}),
    Pet.remove({}),
  ]);
});

describe('POST /api/pets', () => {
  test('200 POST for succcesful posting of a pet', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockPet = {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
          ownerId: mockData.owner._id,
        };

        return superagent.post(apiUrl)
          .send(mockPet)
          .then((response) => {
            expect(response.status).toEqual(200);
          })
          .catch((err) => {
            throw err;
          });
      });
  });
});

describe('GET /api/pets', () => {
  test('200 GET for succesful fetching of a pet', () => {
    return createMockDataPromise()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.pet._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });
});