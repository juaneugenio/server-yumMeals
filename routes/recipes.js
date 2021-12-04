const { Router } = require("express");
// const upload = require("../middleware/cloudinary");
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");
const router = Router();

router.get("/", (req, res) => {
  Recipe.find({}).then((allRecipes) => {
    res.json({ recipes: allRecipes });
  });
});

//upload.single("juanPostPic")
router.post("/create", isLoggedIn, (req, res) => {
  console.log(`LOOOOOOOOOOOK`, req.headers);
  console.log(`reqbody`, req.body);
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

router.get("/:id", (req, res) => {
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
});

// Deleting single Recipe
// router.delete(
//   "/:id/delete",
//   isLoggedIn,
//   (req, res) => {
//     Recipe.findByIdAndDelete(req.body.id)

//   }
// );

module.exports = router;
