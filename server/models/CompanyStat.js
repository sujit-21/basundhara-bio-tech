const mongoose = require('mongoose');

const companyStatSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, 'Please provide the statistic value (e.g., 13+)'],
      trim: true,
    },
    label: {
      type: String,
      required: [true, 'Please provide the label for the statistic (e.g., Industry Sectors)'],
      trim: true,
    },
    color: {
      type: String,
      enum: ['success', 'primary', 'secondary', 'warning', 'info', 'danger'],
      default: 'success',
      required: [true, 'Please provide a color theme for the statistic'],
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanyStat', companyStatSchema);
