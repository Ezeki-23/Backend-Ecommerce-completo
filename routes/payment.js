const express = require("express");
const { Order } = require("../models/order");

require("dotenv").config();

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const customer = ({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems),
    },
  });

  const costo = ({
    metadata: {
      total: JSON.stringify(req.body.total),
    }
  })

  const createOrder = async (customer, costo) => {

  const Items = JSON.parse(customer.metadata.cart);

  const products = Items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      brand: item.brand,
      desc: item.desc,
      price: item.price,
      cartQuantity: item.cartQuantity,
      subtotal: item.price * item.cartQuantity,
    };
  });

  const total = JSON.parse(costo.metadata.total);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    products,
    total,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};
  createOrder(customer, costo);

  res.status(200).end();
  }
);

module.exports = router;
