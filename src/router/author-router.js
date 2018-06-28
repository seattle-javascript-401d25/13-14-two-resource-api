'use strict';

import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Author from '../model/author';


const authorRouter = new Router();

authorRouter.post('/api/read/author', (request, response, next) => {
  Author.init()
    .then(() => {
      logger.log(logger.INFO, `AUTHOR ROUTER BEFORE SAVE: Saved a new author ${JSON.stringify(request.body)}`);
      return new Author(request.body).save();
    })
    .then((newAuthor) => {
      logger.log(logger.INFO, `AUTHOR ROUTER AFTER SAVE: Saved a new author ${JSON.stringify(newAuthor)}`);
      return response.status(201).json(newAuthor);
    })
    .catch(next);
});

authorRouter.get('/api/read/author/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }
  Author.init()
    .then(() => {
      return Author.findById(request.params.id);
    })
    .then((foundAuthor) => {
      logger.log(logger.INFO, `AUTHOR ROUTER: FOUND THE MODEL, ${JSON.stringify(foundAuthor)}`);
      response.status(200).json(foundAuthor);
    })
    .catch(next);
  return undefined;
});

authorRouter.put('/api/read/author/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Author.init()
    .then(() => {
      return Author.findOneAndUpdate({ _id: request.body._id }, request.body);
    })
    .then((foundAuthor) => {
      logger.log(logger.INFO, `AUTHOR ROUTER: AFTER UPDATING ${JSON.stringify(foundAuthor)}`);
      return response.status(200).json(foundAuthor);
    })
    .catch(next);
  return undefined;
});

authorRouter.delete('/api/read/author/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Author.init()
    .then(() => {
      return Author.findById(request.params.id);
    })
    .then((author) => {
      if (!author) { // findBy return null --> author not found 
        next(new HttpErrors(404, 'Attempt to delete non-existant author'));
      }
      return author.remove();
    })
    .then(() => {
      return response.sendStatus(200);
    })
    .catch(next);
  return undefined;
});

export default authorRouter;
