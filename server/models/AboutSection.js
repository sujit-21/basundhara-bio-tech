const mongoose = require('mongoose');

const aboutSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please specify a section type'],
      enum: ['vision_values', 'history', 'facility'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content details'],
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'success',
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

module.exports = mongoose.model('AboutSection', aboutSectionSchema);
