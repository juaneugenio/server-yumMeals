const Rating = require("../models/Rating.model");

module.exports = (req, res, next) => {
  console.log("authorization:", req.headers.authorization);
  const { recipeId } = req.params;
  const { recipe } = req.recipe;
  console.log("recipeIdRating:", recipeId);
  console.log("req.recipeDynRating:", req.recipe);

  Rating.find({ recipe: recipeId })
    .populate("rater recipe")
    .then((rating) => {
      if (!rating) {
        return res.json({ recipe });
      }
      console.log("rating:", rating);
      req.rating = rating;
      res.json({ recipe, rating });

      next();
    });
};
