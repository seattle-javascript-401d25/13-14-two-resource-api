'use strict';

import mongoose from 'mongoose';

const ownerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'pets',
    },
  ],
  
}, { timestamps: true });

ownerRoomSchema.pre('findOne', function preHookCallback(done) {
  this.populate('pets');
  done();
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('owners', ownerSchema, 'owners', skipInit);
