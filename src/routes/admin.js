require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");

require("../db/mongoose");
const Category = require("../models/category");
const User = require("../models/users");

const bcrypt = require("bcrypt");
const { createCipheriv } = require("crypto");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var session;
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("login");
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userdata = await User.findOne({ email: email });
    console.log(userdata.password);
    const valid = await bcrypt.compare(password, userdata.password);

    console.log("#### " + valid);
    if (valid) {
      session = req.session;
      session.email = userdata.email;
      session.userid = userdata._id;
      session.is_active = userdata.is_active;
      session.is_staff = userdata.is_staff;
      session.is_superuser = userdata.is_superuser;
      session.is_pos = userdata.is_pos;
      //req.session.save();
      if (session.is_superuser) {
        console.log(session.is_superuser);
        res.redirect("/admin/clients");
      } else if (session.is_active) {
        console.log(">>>> " + session.is_active + session.email);
        res.redirect("/bill");
      } else {
        req.session.destroy();
        res.status(400).send("<h1>You are not Authorize!</h1>");
      }
    } else {
      console.log("invalid login"); // Handle error
      res.render("login");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/category", async (req, res) => {
  session = req.session;

  if (!session.email) {
    return res.render("login");
  }
  try {
    const cats = await Category.find({});

    res.render("category", { categories: cats });
  } catch (error) {
    console.log("invalid category"); // Handle error
    res.status(400).send(error);
  }
});

router.get("/editcat/:id", async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id });

    return res.render("editcat", { category: category });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/delcat/:id", async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    return res.redirect("/admin/category");
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/category", (req, res) => {
  const category = new Category(req.body);
  category
    .save()
    .then(() => {
      res.send(category);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/categorySave", async (req, res) => {
  try {
    await Category.updateOne(
      { _id: req.body.catid },
      { $set: { name: req.body.name } }
    );
    return res.redirect("/admin/category");
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/register", (req, res) => {
  if (!req.session.is_superuser) {
    return res.redirect("login");
  }
  res.render("register");
});

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/users", async (req, res) => {
  try {
    const user = await User.find({ is_superuser: { $ne: 1 } });
    res.render("users", { user: user });
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
