const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a service title'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Please provide a Bootstrap Icon class name'],
      default: 'bi-activity',
    },
    details: {
      type: String,
      required: [true, 'Please provide detailed info about the service'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Genomics & Sequencing', 'Bioinformatics & AI', 'Therapeutics & Vaccine Development', 'Agricultural Biotech', 'Industrial Enzymes'],
      default: 'Genomics & Sequencing',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
