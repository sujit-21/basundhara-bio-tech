const mongoose = require('mongoose');

const sustainabilitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please specify the sustainability section type'],
      enum: ['hero', 'initiative'],
      default: 'initiative',
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description content'],
      trim: true,
    },
    impact: {
      type: String,
      trim: true,
      default: '', // Only used for circularity initiatives
    },
    icon: {
      type: String,
      trim: true,
      default: 'bi-recycle',
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

module.exports = mongoose.model('Sustainability', sustainabilitySchema);
