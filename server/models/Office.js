const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an office title/name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an office address'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a contact email'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Office', officeSchema);
