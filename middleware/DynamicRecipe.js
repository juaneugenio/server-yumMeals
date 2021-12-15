const Recipe = require("../models/Recipe.model");
const Rating = require("../models/Rating.model");

module.exports = (req, res, next) => {
  const { recipeId } = req.params;
  console.log("req.paramsDR:", req.params);
  Recipe.findById(recipeId)
    .populate("owner")
    .then((recipe) => {
      console.log("DRLine10:", recipe);
      if (!recipe) {
        return res.status(404).json({
          errorMessage: `Post with the id ${recipeId} does not exist`,
        });
      }
      console.log("recipeDR:", recipe);
      req.recipe = recipe;
      next();
    });
};
