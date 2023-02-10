require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");

require("../db/mongoose");
const Product = require("../models/product");
const User = require("../models/users");

const bcrypt = require("bcrypt");
const { createCipheriv } = require("crypto");

// Middleware
const { protect } = require("../middleware/auth");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//get all products
router.get("/product", protect, async (req, res) => {
  try {
    const user_id = req.user.id;
    const prodcuts = await Product.find({ user_id: user_id });
    return res.send(prodcuts);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// get product by category id
router.get("/product/:catid", async (req, res) => {
  const catid = req.params.catid;
  try {
    const prodcuts = await Product.find({ category: catid });
    return res.send(prodcuts);
  } catch (e) {
    res.status(404).send(e.message);
  }
});
//careting product
router.post("/product", protect, (req, res) => {
  req.body.user_email = req.user.email;
  req.body.user_id = req.user.id;
  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.status(201).json({ success: "ture", product });
    })
    .catch((err) => {
      res.status(400).json({ success: "fales", err });
    });
});
//editing product
router.put("/product", protect, async (req, res) => {
  const cname = req.body.name;
  const id = req.body.id;
  try {
    await Product.findOneAndUpdate({ _id: id }, { $set: { name: cname } });
    res.status(204).send();
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete("/product", protect, async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.body.id });
    return res.status(200).json({ result: "true" });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
