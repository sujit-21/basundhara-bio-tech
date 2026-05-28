const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: String,
      default: 'On Inquiry',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=800&auto=format&fit=crop',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate this product with a category'],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    specifications: [
      {
        type: String,
        trim: true,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
