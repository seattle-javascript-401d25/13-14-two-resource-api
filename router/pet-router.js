import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Pet from '../model/pet';

const petRouter = new Router();

petRouter.post('/api/pets', (request, response, next) => {
  Pet.init()
    .then(() => {
      logger.log(logger.INFO, `PET ROUTER: POST BEFORE SAVE: ${JSON.stringify(request.body)}`);
      return new Pet(request.body).save();
    })
    .then((newPet) => {
      logger.log(logger.INFO, `PET ROUTER: POST AFTER SAVE: ${JSON.stringify(newPet)}`);
      response.json(newPet);
    })
    .catch(next);
});

petRouter.get('/api/pets/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Pet.init()
    .then(() => {
      return Pet.findOne({ _id: request.params.id });
    })
    .then((foundPet) => {
      logger.log(logger.INFO, `PET ROUTER: AFTER GETTING PET ${JSON.stringify(foundPet)}`);
      return response.json(foundPet);
    })
    .catch(next);
  return undefined;
});

export default petRouter;