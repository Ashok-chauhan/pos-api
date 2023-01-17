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

router.post("/salebyDate", async (req, res) => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDate;
  if (!req.body.date) {
    const dt = new Date();
    currentDate =
      dt.getFullYear() + "-" + parseInt(dt.getMonth() + 1) + "-" + dt.getDate();
  }
  if (req.body.date) {
    currentDate = req.body.date;
  }

  // Current day query.
  const currentDateEarning = await Sell.aggregate([
    {
      $addFields: {
        onlyDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },
      },
    },
    {
      $match: {
        onlyDate: {
          $eq: currentDate,
        },
      },
    },
    {
      $group: {
        _id: { date: currentDate },
        totalEarning: { $sum: "$net_amount" },
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
        discount: { $sum: "$discount" },
      },
    },
  ]);

  // Previous Week Day query.

  const dt = new Date(req.body.date);
  dt.setDate(dt.getDate() - 7);
  let prevWeekDay =
    dt.getFullYear() + "-" + Number(dt.getMonth() + 1) + "-" + dt.getDate();
  const prevWeekEarning = await Sell.aggregate([
    {
      $addFields: {
        onlyDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },
      },
    },
    {
      $match: {
        onlyDate: {
          $eq: prevWeekDay,
        },
      },
    },
    {
      $group: {
        _id: { date: prevWeekDay },
        totalEarning: { $sum: "$net_amount" },
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
        discount: { $sum: "$discount" },
      },
    },
  ]);

  const dataobj = {};
  const data = currentDateEarning.map((earnings) => {
    dataobj.net_sales = earnings.totalEarning;
    dataobj.gross_sales = earnings.amount;
    dataobj.average_sale = earnings.amount / earnings.count;
    dataobj.transactions = earnings.count;
    dataobj.date = earnings._id.date;
    dataobj.prevWday = weekday[dt.getDay()];
    dataobj.prevDay = dt.getDate();
  });

  const prevWeekobj = {};
  prevWeekEarning.map((prevWeek) => {
    prevWeekobj.net_sales = prevWeek.totalEarning;
    prevWeekobj.gross_sales = prevWeek.amount;
    prevWeekobj.average_sale = prevWeek.amount / prevWeek.count;
    prevWeekobj.transactions = prevWeek.count;
    prevWeekobj.date = prevWeek._id.date;
  });

  res.status(200).json({
    success: true,
    toDayEarning: dataobj,
    previousWeekDay: prevWeekobj,
  });
});

module.exports = router;
