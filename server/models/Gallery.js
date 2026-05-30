const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a gallery item title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      default: 'Farms',
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure the single 'image' field is populated with the first item in the 'images' array
gallerySchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    this.image = this.images[0];
  } else {
    this.image = '';
  }
  next();
});

module.exports = mongoose.model('Gallery', gallerySchema);
