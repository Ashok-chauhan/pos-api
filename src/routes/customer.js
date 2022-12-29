const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");

require("../db/mongoose");
const Customer = require("../models/customers");
const Sell = require("../models/sell");
const Category = require("../models/category");
// Middleware
const { protect } = require("../middleware/auth");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/add", protect, async (req, res) => {
  const pos_id = req.user.id;
  req.body.pos_id = pos_id;
  const customer = new Customer(req.body);
  customer
    .save()
    .then(() => {
      res.status(201).json({ success: true });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
