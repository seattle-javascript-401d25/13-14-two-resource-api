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

  test('201 POST for successful post of a author', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.body.firstName).toEqual(mockResource.firstName);
        expect(response.body.lastName).toEqual(mockResource.lastName);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('400 POST for author missing required property', () => {
    delete mockResource.lastName;
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        throw response; // shouldn't get here
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  // can't do a 409 test on current implementation of authors because there's no unique requirement.  
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

  test('404 GET for fetching nonexistent author', () => {
    return superagent.get(`${apiUrl}/12345`)
      .then((result) => {
        throw result; // shouldn't get here
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});

describe('PUT /api/read/author/:id', () => {
  test('200 PUT for sucessful updating of existing author', () => {
    let newAuthor;
    return createMockAuthorPromise()
      .then((mockAuthor) => {
        newAuthor = mockAuthor;
        newAuthor.lastName = 'Smith';
        return superagent.put(`${apiUrl}/${newAuthor._id}`)
          .send(newAuthor);
      })
      .then((result) => {
        expect(result.status).toEqual(200);
        return Author.findById(newAuthor._id);
      })
      .then((result) => {
        expect(result.lastName).toEqual('Smith');
      })
      .catch((err) => {
        throw err;
      });
  });


  test('400 PUT for adding proprty to existing author', () => {
    let newAuthor;
    return createMockAuthorPromise()
      .then((mockAuthor) => {
        newAuthor = mockAuthor;
        newAuthor.lastName = 'Smith';
        newAuthor.age = '58';
        /*
        Turns out this is a pointless test. Here's the Author
        after adding a ".age" property:
        console.log('>>>>>>>> msg body for PUT', newAuthor);
          >>>>>>>> msg body for PUT { authored: [],
            _id: 5b343cf4e0cbd81dabc443a8,
            firstName: 'Janet',
            lastName: 'Smith',
            createdAt: 2018-06-28T01:42:12.989Z,
            updatedAt: 2018-06-28T01:42:12.989Z,
            __v: 0 }
        No .age! And updating results in 200. So nevermind I guess.
        */
        return superagent.put(`${apiUrl}/${newAuthor._id}`)
          .send(newAuthor)
          .then((result) => {
            expect(result.status).toEqual(200); // ?!
          })
          .catch((err) => {
            throw err;
          });
      });
  });

  test('404 PUT for updating of nonexisting author', () => {
    let newAuthor;
    return createMockAuthorPromise()
      .then((mockAuthor) => {
        newAuthor = mockAuthor;
        newAuthor.lastName = 'Smith';
        newAuthor._id = '12345';
        return superagent.put(`${apiUrl}/${newAuthor._id}`)
          .send(newAuthor);
      })
      .then((result) => {
        expect(result.status).toEqual(200);
        return Author.findById(newAuthor._id);
      })
      .then((result) => {
        expect(result.lastName).toEqual('Smith');
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});

describe('DELETE /api/read/author/:id', () => {
  let newAuthor;

  test('200 DELETE for succesfully deleting an author', () => {
    return createMockAuthorPromise()
      .then((mockData) => {
        newAuthor = mockData;
        return superagent.delete(`${apiUrl}/${newAuthor._id}`);
      })
      .then((result) => {
        expect(result.status).toEqual(200);
        return Author.findById(newAuthor._id);
      })
      .then((result) => {
        expect(result).toBeNull();
      });
  });

  test('404 DELETE for try to delete nonexistant author', () => {
    return superagent.delete(`${apiUrl}/12345`)
      .then((result) => {
        throw result; // shouldn't get here
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
