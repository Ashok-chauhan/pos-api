require("dotenv").config();
const path = require("path");
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

router.get("/thanks/:phone?", (req, res) => {
  // var twilio = require("twilio");
  // const accountSid = "AC18727d75891aa70b1f3f95a4c4b654cc";
  // const authToken = "3973bf8e41c576865069d183d2f40737";
  // var client = new twilio(accountSid, authToken);
  // client.messages
  //   .create({
  //     body: "This is test message from twilio. thnks for advising !",
  //     from: "+17472258645",
  //     to: "+91" + req.params.phone,
  //   })
  //   .then((message) => {
  //     res.status(200).json({ success: message });
  //     console.log(message.sid);
  //     //res.render("thanks");
  //   })
  //   .catch((error) => {
  //     res.status(400).json({ error: error });
  //     console.log(error);
  //   });

  res.render("thanks");
});

router.post("/bill", protect, async (req, res) => {
  const customer = await Customer.findOne({ phone: req.body.customer_phone });

  req.body.customer_id = customer._id;
  req.body.customer_name = customer.name;
  req.body.pos_id = req.user.id;
  let net_amount;
  if (req.body.discount) {
    net_amount = req.body.amount - req.body.discount;
  } else {
    net_amount = req.body.amount;
  }

  req.body.net_amount = net_amount;
  const sell = new Sell(req.body);

  sell
    .save()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
