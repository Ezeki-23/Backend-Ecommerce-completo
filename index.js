const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
const payment = require("./routes/payment");
const productsRoute = require("./routes/products");
const users = require("./routes/users");
const products = require("./products");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', 'https://front-commercomplet.vercel.app');
  res.append('Access-Control-Allow-Methods', 'get, put, post, delete');
  next();
})

app.use(cors({
  credentials: true,
  origin: 'https://front-commercomplet.vercel.app', 
}));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/orders", orders);
app.use("/api/payment", payment);
app.use("/api/products", productsRoute);
app.use("/api/users", users);

app.get("/", (req, res) => {
  res.send("Welcome our to online shop API...");
});

app.get("/products", (req, res) => {
  res.send(products);
});

const uri = process.env.DB_URI;
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
