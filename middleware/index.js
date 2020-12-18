const middlewareObj = {},
  Recipe = require("../models/recipe");

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.user) {
    console.log("user");
    return next();
  } else {
    console.log("not logged in");
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
    return res.json();
  }
};

middlewareObj.checkIfRecipeSaved = (req, res, next) => {
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
            console.log("Recipe Deleted");

            if (err) {
              console.log("Delete err: ", err);
            }
            res.send({ status: "Recipe deleted" });
          });
        }
      }
    }
  );
};

module.exports = middlewareObj;
