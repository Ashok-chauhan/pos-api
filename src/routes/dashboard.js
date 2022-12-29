require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");

require("../db/mongoose");
const Category = require("../models/category");
const User = require("../models/users");
// Middleware
const { protect } = require("../middleware/auth");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createCipheriv } = require("crypto");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/category", protect, async (req, res) => {
  try {
    const cats = await Category.find({ pos_id: req.user.id });
    res
      .status(200)
      .json({ success: true, count: cats.length, categories: cats });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/category", protect, (req, res) => {
  console.log(req.body);
  req.body.pos_email = req.user.email;
  req.body.pos_id = req.user.id;

  const category = new Category(req.body);
  category
    .save()
    .then(() => {
      res.status(201).json({ success: true });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.put("/category", async (req, res) => {
  const cname = req.body.name;
  const id = req.body.id;
  try {
    await Category.findOneAndUpdate({ _id: id }, { $set: { name: cname } });
    res.status(204).send();
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete("/category", async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.body.id });
    return res.status(200).json({ result: "success" });
  } catch (error) {
    return res.status(400).send(error);
  }
});

// router.get("/register", (req, res) => {
//   if (!req.session.is_superuser) {
//     return res.redirect("login");
//   }
//   res.render("register");
// });

router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const userid = await user.save();
    const token = jwt.sign({ id: userid._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, token });

    //res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/useLogin", async (req, res) => {
  //console.log(req.body + "#####");
  const { email, password } = req.body;
  //validate email and password
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide an email and password" });
  }
  // check fo ruser
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  //check if passwod id matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, token });
  //res.status(200).json({ success: true, token });
});

router.get("/users", async (req, res) => {
  try {
    const user = await User.find({ is_superuser: { $ne: 1 } });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/clients", (req, res) => {
  session = req.session;

  if (!session.is_superuser) {
    return res.render("login");
  }
  User.find({ is_superuser: "" }, (err, user) => {
    if (err) {
      return res.send(err);
    }

    res.render("clients", { clients: user });
  });
  //res.render("category");
});

router.post("/clients", (req, res) => {
  const data = {
    is_pos: req.body.is_pos ? req.body.is_pos : "",
    is_staff: req.body.is_staff ? req.body.is_staff : "",
    is_active: req.body.is_active ? req.body.is_active : "",
    id: req.body.id,
  };
  User.findByIdAndUpdate({ _id: req.body.id }, data, (error, user) => {
    if (error) {
      return res.send(error);
    }
    res.redirect("/admin/clients");
  });
});

module.exports = router;
