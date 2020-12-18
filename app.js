const express = require("express"),
  app = express(),
  http = require("http"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  Recipe = require("./models/recipe"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  fetch = require("node-fetch"),
  session = require("express-session"),
  MongoDBStore = require("connect-mongo")(session);

// Require Routes
const indexRoutes = require("./routes/index");
const recipeRoutes = require("./routes/recipe");

require("dotenv").config();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

// Connect to Database
const dbURL = process.env.DB_URL;
const localURL = "mongodb://localhost:27017/melting_pot";
mongoose
  .connect(dbURL, {
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

// Session Configuration
const secret = process.env.SECRET || "The big blue bird bathed all day";

const store = new MongoDBStore({
  url: dbURL,
  secret,
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    store,
    secret,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Configuration
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

// Routes
app.use(indexRoutes);
app.use(recipeRoutes);

// Server Listen

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port: " + port);
});
