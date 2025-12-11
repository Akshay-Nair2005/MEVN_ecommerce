// models/Order.js
const mongoose = require("mongoose");

// One item in the order (usually 1 cart item)
const OrderItemSchema = new mongoose.Schema(
  {
    // This will be the cart item's _id (or product id) coming from frontend/db
    _id: { type: String, required: true }, 

    // You *can* keep uid here if you want, but it's redundant since userUid is on Order
    uid: { type: String },

    // snapshot of the product at purchase time
    product: {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      category: { type: String },
      // add any other product fields you want to store permanently on the order
    },

    quantity: { type: Number, default: 1, min: 1 },
  },
  {
    _id: false, // don't let Mongoose create its own _id for subdocs
  }
);

const OrderSchema = new mongoose.Schema(
  {
    // same as your front-end userUid
    userUid: { type: String, required: true, index: true },

    // array of items from the cart
    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },

    // total paid amount in rupees
    totalAmount: { type: Number, required: true },

    // shipping address used for this order
    address: {
      phone: String,
      pincode: String,
      house: String,
      area: String,
      city: String,
      state: String,
    },

    // payment meta
    payment: {
      provider: { type: String, default: "stripe" },
      paymentIntentId: String,
      status: {
        type: String,
        enum: ["pending", "succeeded", "failed"],
        default: "pending",
      },
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

module.exports = mongoose.model("Order", OrderSchema);
