'use strict';

import mongoose from 'mongoose';
import Owner from './owner';


const petSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'owner',
  },
 
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';


export default mongoose.model('pets', petSchema, 'pets', skipInit);

function petPreHook(done) {
  // done is using an (error,data) signature
  // the value of 'contextual this' is the document
  return Owner.findById(this.ownerId)
    .then((foundOwner) => {
      foundOwner.pets.push(this._id);
      return foundOwner.save();
    })
    .then(() => done()) // done without any arguments mean success - save
    .catch(done); // done with results means an error - do not save
}

const petPostHook = (document, done) => {
  // document refers to the current instance of this pet schema
  return Owner.findById(document.ownerId)
    .then((foundOwner) => {
      foundOwner.pets = foundOwner.pets.filter(pet => pet._id.toString() !== document._id.toString());
      return foundOwner.save();
    })
    .then(() => done())
    .catch(done);
};

petSchema.pre('save', petPreHook);
petSchema.post('remove', petPostHook);