const Recipe = require("../models/Recipe.model");

module.exports = (req, res, next) => {
  const { id } = req.params;
  console.log("req.params:", req.params);
  Recipe.findById(id)
    .populate("owner")
    .then((recipe) => {
      if (!recipe) {
        return res
          .status(404)
          .json({ errorMessage: `Post with the id ${id} does not exist` });
      }

      req.recipe = recipe;

      res.json({ recipe });

      next();
    });
};
