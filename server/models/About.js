const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide a role'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide qualification details'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Please provide a bio summary'],
      trim: true,
    },
    icon: {
      type: String,
      default: 'bi-person',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('About', aboutSchema);
