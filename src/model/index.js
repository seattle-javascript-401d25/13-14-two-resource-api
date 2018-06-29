'use strict';

import util from 'util';
import fs from 'fs';

const buildModelRouterP = util.promisify(fs.readdir);
const modelPath = `${__dirname}`;

console.log(modelPath);

export default () => {
  return buildModelRouterP(modelPath)
    .then((models) => {
      const newModels = models.filter(model => model !== 'index.js').map(model => `./${model}`);
      const modelMap = newModels.reduce((storage, currentModel) => {
        const model = require(currentModel) /*eslint-disable-line*/
        const isMongooseModel = model.default && model.default.modelName;
        const modelName = isMongooseModel ? model.default.modelName : currentModel;
        storage[modelName] = model;
        return storage;
      }, {});
      return modelMap;
    })
    .catch((err) => {
      throw err;
    });
};
