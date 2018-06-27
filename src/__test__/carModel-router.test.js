'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import CarMake from '../model/carMake';
import CarModel from '../model/carModel';
import pCreateMockData from './lib/carModelMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/models`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => {
  Promise.all([
    CarMake.remove({}),
    CarModel.remove({}),    
  ]);
});

describe('POST /api/models', () => {
  test('200 POST for sucessful posting of a model', () => {
    return pCreateMockData()
      .then((mockData) => {
        const mockModel = {
          name: faker.name.firstName(),
          vin: faker.random.number(100000000, 999999999),
          carMakeId: mockData.carMake._id,
        };
        return superagent.post(apiUrl)
          .send(mockModel)
          .then((res) => {
            expect(res.status).toEqual(200);
          })
          .catch((err) => {
            throw err;
          });
      });
  });
});

describe('GET /api/models', () => {
  test('200 GET for successful fetching of a model', () => {
    return pCreateMockData()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.carModel._id}`);
      })
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });
});
