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

router.post("/check", protect, async (req, res) => {
  const customer = await Customer.findOne({
    phone: req.body.phone,
    pos_id: req.user.id,
  });
  if (!customer) {
    return res.status(200).json({ success: false });
  } else {
    return res.status(200).json({ success: true, customer });
  }
});

router.get("/customerCount", protect, async (req, res) => {
  const customerCount = await Customer.find({ pos_id: req.user.id });
  if (!customerCount) {
    return res.status(200).json({ success: false });
  }
  return res.status(200).json({ success: true, count: customerCount.length });
});

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
