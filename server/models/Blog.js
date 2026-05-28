const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide the blog content'],
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      default: 'Basundhara Bio-Tech Research Team',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slugify pre-save middleware
blogSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
