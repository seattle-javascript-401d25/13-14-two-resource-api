'use strict';

import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Book from '../model/book';

const bookRouter = new Router();

bookRouter.post('/api/read/book', (request, response, next) => {
  Book.init()
    .then(() => {
      logger.log(logger.INFO, `BOOK ROUTER: POST BEFORE SAVE: ${JSON.stringify(request.body)}`);
      return new Book(request.body).save();
    })
    .then((newBook) => {
      logger.log(logger.INFO, `BOOK ROUTER: POST AFTER SAVE: ${JSON.stringify(newBook)}`);
      response.status(201).json(newBook);
    })
    .catch(next);
});

bookRouter.get('/api/read/book/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Book.init()
    .then(() => {
      return Book.findById(request.params.id);
    })
    .then((foundBook) => {
      logger.log(logger.INFO, `BOOK ROUTER: AFTER GETTING BOOK ${JSON.stringify(foundBook)}`);
      return response.json(foundBook);
    })
    .catch(next);
  return undefined;
});

bookRouter.put('/api/read/book/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Book.init()
    .then(() => {
      return Book.findOneAndUpdate({ _id: request.body._id }, request.body);
    })
    .then((foundBook) => {
      logger.log(logger.INFO, `BOOK ROUTER: AFTER UPDATING BOOK ${JSON.stringify(foundBook)}`);
      return response.json(foundBook);
    })
    .catch(next);
  return undefined;
});

bookRouter.delete('/api/read/book/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Book.init()
    .then(() => {
      return Book.findById(request.params.id);
    })
    .then((book) => {
      if (!book) { // findBy return null --> book not found 
        return next(new HttpErrors(404, 'Attempt to delete non-existant book'));
      }
      return book.remove();
    })
    .then(() => {
      return response.sendStatus(200);
    })
    .catch(next);
  return undefined;
});
export default bookRouter;
