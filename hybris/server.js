const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const searchRoute = require("./api/search/search");
const productRoute = require("./api/product/product");
const supplierRoute = require("./api/supplier/supplier");
const registerRoute = require("./api/user/register");
const loginRoute = require("./api/user/login");
const cartRoute = require("./api/cart/cart");
const shippingOptionsRoute = require("./api/shippingOptions/shippingOptions");
const checkoutRoute = require("./api/checkout/checkout");
const orderRoute = require("./api/order/order");
const invoiceRoute = require("./api/order/invoice");
const { router: offersRoute } = require("./api/offers/offer");
const pageRoute = require("./api/pages/pages");
const resetPasswordRoute = require("./api/user/reset-password");
const userRoute = require("./api/user/user");
require("dotenv").config();

const port = 5000;
const mongoString = process.env.MONGODB_URI;
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "25mb" }));
app.use(bodyParser.json({ limit: "25mb" }));

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use("/search", searchRoute);
app.use("/supplier", supplierRoute);
app.use("/p", productRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/cart", cartRoute);
app.use("/shipping-options", shippingOptionsRoute);
app.use("/checkout", checkoutRoute);
app.use("/orders", orderRoute);
app.use("/invoice", invoiceRoute);
app.use("/my-offers", offersRoute);
app.use("/pages", pageRoute);
app.use("/reset-password", resetPasswordRoute);
app.use("/user", userRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
