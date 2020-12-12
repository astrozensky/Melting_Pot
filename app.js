const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

// Connect to Database
const url = process.env.DATABASEURL || "mongodb://localhost:27017/melting_pot";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });

// Passport Configuration
app.use(
  require("express-session")({
    secret: "The big blue bird bathed all day",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ==============================
// Routes
// ==============================

// Landing Route
app.get("/", (req, res) => {
  res.render("landing");
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Show login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle user login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// Show Register form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle new user
app.post("/register", (req, res) => {
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
app.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/");
});

// Profile Route
app.get("/:id", (req, res) => {
  res.render("profile");
});

// // Recipe Show route
// app.get("/recipes/:id", (req,res) => {
//     let url = "https://api.spoonacular.com/recipes/" + req.params.id + "/information?apiKey=69eba1cad9c44ee4ac0e44e3ea0a25ef&includeNutrition=false";
//     let settings = { method: "Get" };

//     fetch(url, settings)
//         .then(res => res.json())
//         .then((json) => {
//             res.render("recipes/show", {recipe: json});
//         });
// });

// Server Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port: " + port);
});
