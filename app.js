const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

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

// Landing Route
app.get("/login", (req, res) => {
  res.render("login");
});

// Landing Route
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Landing Route
app.get("/users/:id", (req, res) => {
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
