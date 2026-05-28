const mongoose = require('mongoose');

const importExportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an import/export service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a service description'],
    },
    destinationCountries: [
      {
        type: String,
        trim: true,
      },
    ],
    shippingModes: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'scheduled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ImportExport', importExportSchema);
