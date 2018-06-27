'use strict';

import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Model from '../model/carModel';

const modelRouter = new Router();

modelRouter.post('/api/models', (req, res, next) => {
  Model.init()
    .then(() => {
      logger.log(logger.INFO, `Model Router: POST BEFORE save: ${JSON.stringify(req.body)}`);
      return new Model(req.body).save();
    })
    .then((newModel) => {
      logger.log(logger.INFO, `Model Router: POST AFTER save: ${JSON.stringify(newModel)}`);    
      res.json(newModel);
    })
    .catch(next);
});

modelRouter.get('/api/models/:id?', (req, res, next) => {
  if (!req.params.id) {
    return next(new HttpErrors(400, 'Did not enter an ID'));
  }

  Model.init()
    .then(() => {
      return Model.findOne({ _id: req.params.id });
    })
    .then((foundModel) => {
      logger.log(logger.INFO, `Model Router: AFTER getting model: ${JSON.stringify(foundModel)}`);    
      return res.json(foundModel);
    })
    .catch(next);
  return undefined;
});

export default modelRouter;
