const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Define Schema
const RecipeSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

RecipeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Recipe", RecipeSchema);
