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

bookSchema.pre('findOne', function preQueryHook(done) {
  this.populate('author');
  done();
});

bookSchema.post('remove', (book, done) => {
  console.log('.... BOOK post Remove', JSON.stringify(book, null, 2));
  Author.findById(book.author._id)
    .then((author) => {
      console.log('.... AUTHOR in BOOK post remove', JSON.stringify(author, null, 2));
      author.authored = author.authored.filter(bId => bId !== book._id.toString());
      return author.save();
    })
    .then(done())
    .catch((err) => {
      throw err;
    });
});

bookSchema.post('save', (book) => {
  Author.findById(book.author)
    .then((author) => {
      author.authored.push(book._id);
      return author.save();
    })
    .catch((err) => {
      throw err;
    });
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('books', bookSchema, 'books', skipInit);
