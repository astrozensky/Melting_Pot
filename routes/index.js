const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  Recipe = require("../models/recipe"),
  User = require("../models/user");

// Landing Route
router.get("/", (req, res) => {
  res.render("landing");
});

// About Route
router.get("/about", (req, res) => {
  res.render("about");
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle user login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// Show Register form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle new user
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(`Error: ${err}`);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", `Welcome to Melting Pot ${user.username}!`);
      res.redirect("/");
    });
  });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/");
});

// Profile Route
router.get("/:id", (req, res) => {
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  Recipe.find({ author: author }, function (err, foundRecipes) {
    if (err) {
      console.log("Saved recipe find error: ", err);
    } else {
      console.log("Found recipes: ", foundRecipes);
      res.render("profile", { foundRecipes: foundRecipes });
    }
  });
});

module.exports = router;
