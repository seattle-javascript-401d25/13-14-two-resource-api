'use strict';

import faker from 'faker';
import Author from '../../model/author';

export default () => {
  const mockResouceToPost = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
  return new Author(mockResouceToPost).save();
};
