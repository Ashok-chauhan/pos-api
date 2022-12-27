const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
require("./db/mongoose");
const sessions = require("express-session");

// load route
const admin = require("./routes/admin");
const billing = require("./routes/billing");
const analytics = require("./routes/analytics");

const app = express();
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "ashokKumarchauhan9",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//var session;

app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(express.static(publicDirectory));

hbs.registerPartials(partialsPath);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("", billing);
app.use("/admin", admin);
app.use("/analytics", analytics);

app.listen(3001, "127.0.0.1", () => {
  console.log("listening on port 3001");
});
