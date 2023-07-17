const express = require("express");
const mongoose = require("mongoose");
const app = express();
const searchRoute = require("./api/search");
const port = 5000;
const mongoString =
  "mongodb+srv://likhithgraju:qUY0MaYYHrPk2E0n@cluster0.dudrojd.mongodb.net/avantor";
const bodyParser = require("body-parser");

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
// Define a route for the home page

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
