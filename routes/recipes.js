const { Router } = require("express");
// const upload = require("../middleware/cloudinary");
const isLoggedIn = require("../middleware/isLoggedIn");
const Rating = require("../models/Rating.model");
const Recipe = require("../models/Recipe.model");
const router = Router();

router.get("/", (req, res) => {
  Recipe.find({}).then((allRecipes) => {
    res.json({ recipes: allRecipes });
  });
});

//upload.single("juanPostPic")
router.post("/create", isLoggedIn, (req, res) => {
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
  // console.log(req.params);

  Recipe.findById(id)
    .populate("owner")
    .then((recipe) => {
      console.log("THIS IS A RECIPE", recipe);
      if (!recipe) {
        return res
          .status(404)
          .json({ errorMessage: `Recipe with the id ${id} does not exist` });
      }

      res.json({ recipe });
      // console.log(recipe);
    });
});

router.post("/comment", isLoggedIn, (req, res) => {
  // console.log(`LOOOOOOOOOOOK`, req.headers);
  // console.log(`reqbody`, req.body);
  Rating.create({
    user: req.user._id,
    recipe: req.body.recipeId,
    rating: req.body.userRating,
    comment: req.body.comment,

    // image: req.file.path,
  })
    .then((createRating) => {
      console.log("createRating:", createRating);
      res.json({ rating: createRating });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ errorMessage: "Something fed up" });
    });
});

// Deleting singleRecipe goes here in the Backend and then we can go to the related handleDeleteSingleRecipe in the frontend
router.delete("/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  // console.log(req.params);
  Recipe.findByIdAndDelete(id)
    .then((deletedRecipe) =>
      res.status(200).json({ message: `Recipe ${deletedRecipe} was deleted` })
    )
    .catch((error) =>
      res.status(500).json({ message: "Something went wrong" })
    );
});

router.put("/edit", isLoggedIn, (req, res) => {
  // const { id } = req.params;

  Recipe.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
      },
    },
    { new: true }
  )
    .then((info) => {
      res.json(info);
    })
    .catch((err) => res.status(400).json({ msg: "update failed" }));
});

module.exports = router;
