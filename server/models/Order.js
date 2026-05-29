const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Please provide an order number'],
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer contact phone is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Cargo shipping address is required'],
        trim: true,
      },
      paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false,
        },
        title: {
          type: String,
          required: [true, 'Item title is required'],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, 'Item unit price is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Item quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        subtotal: {
          type: Number,
          required: [true, 'Item subtotal is required'],
        },
      },
    ],
    summary: {
      subtotal: {
        type: Number,
        required: [true, 'Summary subtotal is required'],
      },
      tax: {
        type: Number,
        required: [true, 'Summary tax is required'],
      },
      shipping: {
        type: Number,
        required: [true, 'Summary shipping charge is required'],
      },
      grandTotal: {
        type: Number,
        required: [true, 'Summary grand total is required'],
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
