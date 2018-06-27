'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import CarMake from '../model/carMake';

const carMakeRouter = new Router();

carMakeRouter.post('/api/make', (req, res, next) => {
  CarMake.init()
    .then(() => {
      logger.log(logger.INFO, `Car Make Router BEFORE Save: Saving a new Car Make ${JSON.stringify(req.body)}`);
      return new CarMake(req.body).save();
    })
    .then((newCarMake) => {
      logger.log(logger.INFO, `Car Make Router AFTER Save: Saving a new Car Make ${JSON.stringify(newCarMake)}`);
      return res.json(newCarMake);
    })
    .catch(next);
});

carMakeRouter.get('/api/make/:id?', (req, res, next) => {
  CarMake.init()
    .then(() => {
      return CarMake.findOne({ _id: req.params.id });
    })
    .then((foundCarMake) => {
      logger.log(logger.INFO, `Car Make Router found the model ${JSON.stringify(foundCarMake)}`);
      res.json(foundCarMake);
    })
    .catch(next);
});

export default carMakeRouter;
