'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import CarMake from '../model/carMake';
import pCreateMockMake from './lib/carMakeMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/make`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => CarMake.remove({}));

describe('POST /api/make', () => {
  const mockResource = {
    name: faker.name.firstName(),
    country: faker.address.country(),
  };

  test('200 POST for successful POST of a Car Make', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(mockResource.name);
        expect(res.body.country).toEqual(mockResource.country);
        expect(res.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('GET /api/make', () => {
  test('200 GET for successful fetching of a car make', () => {
    let returnedCarMake;
    return pCreateMockMake()
      .then((newCarMake) => {
        returnedCarMake = newCarMake;
        return superagent.get(`${apiUrl}/${newCarMake._id}`);
      })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(returnedCarMake.name);
        expect(res.body.country).toEqual(returnedCarMake.country);
      })
      .catch((err) => {
        throw err;
      });
  });
});

