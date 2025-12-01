// models/Order.js
const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // product/cart item id from frontend
  uid: { type: String },                  // redundant if needed
  product: {
    title: String,
    price: Number,
    image: String,
    category: String,
    // ... add other product fields if you store them
  },
  quantity: { type: Number, default: 1 },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userUid: { type: String, required: true, index: true },
  items: { type: [OrderItemSchema], required: true, default: [] },
  totalAmount: { type: Number, required: true }, // store the paid amount (in rupees)
  address: {
    phone: String,
    pincode: String,
    house: String,
    area: String,
    city: String,
    state: String
  },
  payment: {
    provider: { type: String, default: "stripe" },
    paymentIntentId: String,
    status: { type: String, default: "pending" } // pending / succeeded / failed
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
