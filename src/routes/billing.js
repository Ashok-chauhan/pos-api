require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");

require("../db/mongoose");
const Customer = require("../models/customers");
const Category = require("../models/category");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var session;
router.get("", (req, res) => {
  res.render("login");
});
router.get("/bill", async (req, res) => {
  session = req.session;

  if (!session.is_pos) {
    return res.render("login", { error: "error" });
  }
  const category = await Category.find({});

  res.render("bill", { category });
});
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

router.post("/bill", (req, res) => {
  let total_amount;
  if (req.body.discount) {
    total_amount = req.body.amount - req.body.discount;
  } else {
    total_amount = req.body.amount;
  }
  // console.log(total_amount);

  req.body.total_amount = total_amount;
  const customer = new Customer(req.body);

  customer
    .save()
    .then(() => {
      // res.send(customer);
      res.redirect("/thanks/" + req.body.phone);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
