'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import Owner from '../model/owner';


const ownerRouter = new Router();

ownerRouter.post('/api/owners', (request, response, next) => {
  Owner.init()
    .then(() => {
      logger.log(logger.INFO, `OWNER ROUTER BEFORE SAVE: Saved a new owner ${JSON.stringify(request.body)}`);
      return new Owner(request.body).save();
    })
    .then((newOwner) => {
      logger.log(logger.INFO, `OWNER ROUTER AFTER SAVE: Saved a new owner ${JSON.stringify(newOwner)}`);
      return response.json(newOwner);
    })
    .catch(next);
});

ownerRouter.get('/api/owners/:id?', (request, response, next) => {
  Owner.init()
    .then(() => {
      return Owner.findOne({ _id: request.params.id });
    })
    .then((foundOwner) => {
      logger.log(logger.INFO, `OWNER ROUTER: FOUND THE MODEL, ${JSON.stringify(foundOwner)}`);
      response.json(foundOwner);
    })
    .catch(next);
});


export default ownerRouter;