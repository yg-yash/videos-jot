const express = require("express");
const route = express.Router();
const Idea = require("../models/idea");

//load helper
const { ensureAuthenticated } = require("../helpers/auth");

//idea index page
route.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas
      });
    });
});

//add idea form
route.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//edit idea
route.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  const _id = req.params.id;
  try {
    const idea = await Idea.findOne({ _id });
    if (idea.user !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/ideas");
    }

    res.render("ideas/edit", {
      idea
    });
  } catch (e) {
    console.log(e);
  }
});

//process form
route.post("/", ensureAuthenticated, async (req, res) => {
  try {
    let errors = [];
    if (!req.body.title) {
      errors.push({ text: "please add a title" });
    }
    if (!req.body.details) {
      errors.push({ text: "please add some details" });
    }
    if (errors.length > 0) {
      return res.render("ideas/add", {
        errors,
        title: req.body.title,
        details: req.body.details
      });
    }
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    const user = await new Idea(newUser).save();

    if (!user) {
      throw new Error("idea coudnt add");
    }
    req.flash("success_msg", "Video Idea Added");
    res.redirect("/ideas");
  } catch (e) {
    console.log(e);
  }
});

//edit form process
route.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const _id = req.params.id;
    const idea = await Idea.findOne({ _id });

    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    await idea.save();
    req.flash("success_msg", "Video Idea Updated");
    res.redirect("/ideas");
  } catch (e) {
    console.log(e);
  }
});

//delete idea
route.delete("/:id", ensureAuthenticated, async (req, res) => {
  const _id = req.params.id;
  try {
    await Idea.findOneAndDelete({ _id });
    req.flash("success_msg", "Video Idea Removed");
    res.redirect("/ideas");
  } catch (e) {
    console.log("idea couldn't delete");
  }
});

module.exports = route;
