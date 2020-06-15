const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/user");

//user login route
router.get("/login", async (req, res) => {
  res.render("users/login");
});

//user register route
router.get("/register", async (req, res) => {
  res.render("users/register");
});

//login form post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//register form post
router.post("/register", async (req, res) => {
  try {
    let errors = [];
    if (req.body.password !== req.body.cpassword) {
      errors.push({ text: "Passwords do not match" });
    }
    if (req.body.password.length <= 5) {
      errors.push({ text: "Password must be atleast 6 characters" });
    }
    if (errors.length > 0) {
      return res.render("users/register", {
        errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword
      });
    }
    const emailCheck = await User.findOne({ email: req.body.email });

    if (emailCheck) {
      req.flash("error_msg", "Email Already Taken");
      return res.redirect("/users/register");
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });
    const user = await newUser.save();
    if (!user) {
      req.flash("error_msg", "Cant Add The User Try Again");
      return res.render("users/register");
    }
    req.flash("success_msg", "You are now registered and login");
    res.redirect("/users/login");
  } catch (e) {
    console.log(e);
  }
});

//logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You Are Logged Out");
  res.redirect("/users/login");
});

module.exports = router;
