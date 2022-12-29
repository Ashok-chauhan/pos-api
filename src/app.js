const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
require("./db/mongoose");
const cookieParser = require("cookie-parser");
// load route
const dashboard = require("./routes/dashboard");
const sell = require("./routes/sell");
const products = require("./routes/products");
const customers = require("./routes/customer");

const app = express();
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", dashboard);
app.use("/api/v1", products);
app.use("/api/v1", sell);
app.use("/api/v1/customer", customers);

app.listen(3000, "127.0.0.1", () => {
  console.log("listening on port 3000");
});
