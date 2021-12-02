const { Router } = require("express");
// const upload = require("../middleware/cloudinary");
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");
const router = Router();

router.get("/", isLoggedIn, (req, res) => {
  Recipe.find({}).then((allRecipes) => {
    res.json({ recipes: allRecipes });
  });
});

//upload.single("juanPostPic")
router.post("/create", isLoggedIn, (req, res) => {
  // console.log(`LOOOOOOOOOOOK`, req.headers);
  console.log(req.body);
  Recipe.create({
    owner: req.user._id,
    title: req.body.title,
    category: req.body.category,
    ingredients: req.body.ingredients,
    stepsRecipe: req.body.stepsRecipe,

    // image: req.file.path,
  })
    .then((createRecipe) => {
      console.log(createRecipe);
      res.json({ recipes: createRecipe });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ errorMessage: "Something fed up" });
    });
});

// router.get("/:recipeId", (req, res) => {
//   const { recipeId } = req.params;

//   const singleRecipe = allRecipes.find((element) => element.id === recipeId);
//   if (!singleRecipe) {
//     return res
//       .status(404)
//       .json({ errorMessage: `Recipe with the id ${recipeId} does not exist` });
//   }
//   res.json({ recipe: singleRecipe });
// });

// router.get("/:recipeId", (req, res) => {
//   const { recipeId } = req.params;

//   Recipe.findById(recipeId)
//   .populate("owner")
//   .then((singleRecipe) => {
//   if (!singleRecipe) {
//     return res
//       .status(404)
//       .json({ errorMessage: `Recipe with the id ${recipeId} does not exist` });
//   }
//   res.json({ recipe: singleRecipe });
// });

router.get("/:dynamic", (req, res) => {
  const { dynamic } = req.params;

  Recipe.findById(dynamic)
    .populate("owner")
    .then((singleRecipe) => {
      if (!singleRecipe) {
        return res.status(404).json({
          errorMessage: `Recipe with the id ${dynamic} does not exist`,
        });
      }
      res.json({ recipe: singleRecipe });
    });
});

module.exports = router;
