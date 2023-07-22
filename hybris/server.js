const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const searchRoute = require("./api/search/search");
const productRoute = require("./api/product/product");
const supplierRoute = require("./api/supplier/supplier");
const registerRoute = require("./api/user/user");
const port = 5000;
const mongoString =
  "mongodb+srv://likhithgraju:qUY0MaYYHrPk2E0n@cluster0.dudrojd.mongodb.net/avantor";
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Define a route for the home page

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
