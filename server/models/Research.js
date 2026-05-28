const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a publication title'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Please provide the research abstract'],
    },
    authors: {
      type: String,
      required: [true, 'Please provide list of authors'],
      trim: true,
    },
    journal: {
      type: String,
      required: [true, 'Please provide the journal or conference name'],
      trim: true,
      default: 'Basundhara Scientific Review',
    },
    publishDate: {
      type: Date,
      required: [true, 'Please provide publish date'],
      default: Date.now,
    },
    doi: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      default: '#',
    },
    category: {
      type: String,
      required: [true, 'Please provide a research category'],
      enum: ['Molecular Biology', 'AI Diagnostics', 'Cancer Immunotherapy', 'Biofuels & Sustainability', 'Gene Editing & CRISPR'],
      default: 'Molecular Biology',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Research', researchSchema);
