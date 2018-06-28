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
  this.populate('authors');
  done();
});

bookSchema.post('remove', (book) => {
  Author.findById(book.author)
    .then((author) => {
      author.authored = author.authored.filter(bId => bId !== book._id);
    });
});

bookSchema.post('save', (book) => {
  Author.findById(book.author)
    .then((author) => {
      author.authored.push(book._id);
    });
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('books', bookSchema, 'books', skipInit);
