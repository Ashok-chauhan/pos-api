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
router.get("", async (req, res) => {
  session = req.session;
  if (!session.is_pos) {
    return res.render("login", { error: "error" });
  }
  const dt = new Date();
  const currentDate =
    dt.getFullYear() + "-" + parseInt(dt.getMonth() + 1) + "-" + dt.getDate();

  const currentDateEarning = await Customer.aggregate([
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
        totalEarning: { $sum: "$total_amount" },
        amount: { $sum: "$amount" },
        discount: { $sum: "$discount" },
      },
    },
  ]);

  res.render("analytics", { currentDateEarning });
});

router.post("/categoryByDate", async (req, res) => {
  const earningByCategory = await Customer.aggregate([
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
          $eq: req.body.date,
        },
      },
    },
    {
      $group: {
        _id: { category: "$category" },
        totalEarning: { $sum: "$total_amount" },
      },
    },
  ]);

  return res.send(earningByCategory);
});

router.post("/customer", async (req, res) => {
  const customer = await Customer.aggregate([
    { $match: { phone: parseInt(req.body.phone) } },
    {
      $group: {
        _id: { category: "$category" },
        totalEarning: { $sum: "$total_amount" },
      },
    },
  ]);

  res.send(customer);
});

router.post("/detailsbydate", async (req, res) => {
  const details = await Customer.aggregate([
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
          $eq: req.body.date,
        },
      },
    },
  ]);

  res.send(details);
});
module.exports = router;
