'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Owner from '../model/owner';
import createMockOwnerPromise from './lib/ownerMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/owners`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => Owner.remove({}));

describe('POST /api/owners', () => {
  const mockResource = {
    name: faker.name.firstName(),
    teacher: 'Vinicio',
  };

  test('200 POST for successful post of a owner', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(mockResource.name);
        expect(response.body.teacher).toEqual(mockResource.teacher);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('GET /api/owners', () => {
  test('200 GET for successful fetching of a owner', () => {
    let returnedOwner;
    return createMockOwnerPromise()
      .then((newOwner) => {
        returnedOwner = newOwner;
        return superagent.get(`${apiUrl}/${newOwner._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(returnedOwner.name);
        expect(response.body.teacher).toEqual(returnedOwner.teacher);
      })
      .catch((err) => {
        throw err;
      });
  });
});