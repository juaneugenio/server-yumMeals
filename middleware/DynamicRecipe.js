module.exports = (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  Recipe.findById(id)
    .populate("owner")
    .then((recipe) => {
      if (!recipe) {
        return res
          .status(404)
          .json({ errorMessage: `Post with the id ${id} does not exist` });
      }

      res.json({ recipe });
      console.log(recipe);
    });
};
