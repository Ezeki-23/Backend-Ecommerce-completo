const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      { 
        id: { type: String }, 
        name: { type: String },
        brand: { type: String },
        desc: { type: String },
        price: { type: String },
        cartQuantity: { type: Number, default: 1 }, 
        subtotal: { type: Number, required: true }, }
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

exports.Order = Order;
