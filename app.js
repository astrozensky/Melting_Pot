const express = require("express"),
  app = express(),
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

// ==============================
// Middleware
// ==============================

function isLoggedIn(req, res, next) {
  if (req.user) {
    console.log("user");
    return next();
  } else {
    console.log("not logged in");
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }
}

function checkIfRecipeSaved(req, res, next) {
  Recipe.findOne(
    {
      id: req.body.id,
      author: { id: req.user._id, username: req.user.username },
    },
    function (err, foundRecipe) {
      if (err) {
        console.log("Find one error: ", err);
      } else {
        if (foundRecipe === null) {
          return next();
        } else {
          Recipe.deleteOne(foundRecipe, function (err) {
            req.flash("error", "Recipe has been revomed from saved recipes");
            res.redirect("/");
            if (err) {
              console.log("Delete err: ", err);
            }
          });
        }
      }
    }
  );
}

// ==============================
// Routes
// ==============================

// Landing Route
app.get("/", (req, res) => {
  res.render("landing");
});

// Save recipe to profile
app.post("/", [isLoggedIn, checkIfRecipeSaved], (req, res) => {
  const recipeId = req.body.id;
  const recipeTitle = req.body.title;
  const recipeImage = req.body.image;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  const newRecipe = new Recipe({
    id: recipeId,
    title: recipeTitle,
    image: recipeImage,
    author: author,
  });

  newRecipe
    .save()
    .then((recipe) => {
      res.json(recipe);
    })
    .catch((err) => {
      console.log("Save error: ", err);
    });
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

// Profile recipe delete route
app.delete("/:id", (req, res) => {
  const recipeId = req.body.deleteBtn;
  console.log(recipeId);

  Recipe.findOneAndDelete({ id: recipeId }, function (err, deletedRecipe) {
    if (err) {
      console.log("Delete recipe error: ", err);
    } else {
      console.log("Deleted recipe: ", deletedRecipe);
      req.flash("success", "Recipe deleted");
      res.redirect(`/${req.user._id}`);
    }
  });
});

// Recipe Show route
app.get("/recipe/:id", (req, res) => {
  let saved = false;
  console.log(req.user);
  if (req.user) {
    Recipe.findOne(
      {
        id: req.params.id,
        author: { id: req.user._id, username: req.user.username },
      },
      function (err, foundRecipe) {
        if (err) {
          console.log("Find one error: ", err);
        } else {
          if (foundRecipe !== null) {
            saved = true;
          }
        }
      }
    );
  }

  let url = `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=69eba1cad9c44ee4ac0e44e3ea0a25ef&includeNutrition=false`;
  let settings = { method: "Get" };

  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      res.render("recipe/show", { recipe: json, saved: saved });
    });
});

// Server Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port: " + port);
});
