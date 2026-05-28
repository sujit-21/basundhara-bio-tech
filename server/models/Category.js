const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a category description'],
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop',
    },
    subCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Slugify pre-save
categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

module.exports = mongoose.model('Category', categorySchema);
