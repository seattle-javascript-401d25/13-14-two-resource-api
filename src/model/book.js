'use strict';

import mongoose from 'mongoose';
import Author from './author';

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'authors',
    required: true,
  },
  description: {
    type: String,
    minlength: 10,
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook'],
    default: 'hardcover',
  },
}, { timestamps: true });

// bookSchema.pre('findOne', function preQueryHook(done) {
//   console.log('***** 1 ****** book findOne pree "this"', this);
//   this.populate('authors');
//   done();
// });

bookSchema.post('remove', (book) => {
  Author.findById(book.author)
    .then((author) => {
      author.authored = author.authored.filter(bId => bId !== book._id);
      author.save();
    })
    .catch((err) => {
      throw err;
    });
});

bookSchema.post('save', (book) => {
  Author.findById(book.author)
    .then((author) => {
      console.log('----- 1 ----- entry to BOOK SAVE POST hook book', JSON.stringify(book, null, 2));
      for (let i = 0; i < 100000000; i++) {}
      author.authored.push(book._id);
      return author.save();
    })
    .then((author) => {
      console.log('---- 2 ---- author after save from BOOK SAVE POST hook', JSON.stringify(author, null, 2));
      for (let i = 0; i < 100000000; i++) {}      
    })
    .catch((err) => {
      throw err;
    });
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('books', bookSchema, 'books', skipInit);
