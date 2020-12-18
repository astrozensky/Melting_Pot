const express = require("express"),
  router = express.Router(),
  Recipe = require("../models/recipe"),
  middleware = require("../middleware"),
  fetch = require("node-fetch");

// Save recipe to profile
router.post(
  "/",
  [middleware.isLoggedIn, middleware.checkIfRecipeSaved],
  (req, res) => {
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
        console.log(recipe);
        res.json(recipe);
      })
      .catch((err) => {
        console.log("Save error: ", err);
      });
  }
);

// Recipe Show route
router.get("/recipe/:id", (req, res) => {
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

// Profile recipe delete route
router.delete("/:id", (req, res) => {
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

module.exports = router;
