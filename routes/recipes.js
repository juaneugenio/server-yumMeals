const { Router } = require("express");
const DynamicRecipe = require("../middleware/DynamicRecipe");
// const upload = require("../middleware/cloudinary");
const isLoggedIn = require("../middleware/isLoggedIn");
const Rating = require("../models/Rating.model");
const Recipe = require("../models/Recipe.model");
const router = Router();
const compareIds = require("../utils/compareIds");

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

router.get("/:recipeId", (req, res) => {
  console.log("authorization:", req.headers.authorization);
  const sessionId = req.headers.authorization;
  console.log("sessionId:", sessionId);
  /**
   * req.headers.authorization's value is the access token = the ID of the session
   * which is unique for every user, and stored in the DB in the Session Collection
   *
   *  */

  const { recipeId } = req.params;
  console.log("req.params:", req.params);
  Recipe.findById(recipeId)
    .populate("owner")
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({
          errorMessage: `The recipe with this id ${recipeId} does not exist`,
        });
      }

      Rating.find({ recipe: recipeId })
        .populate("user recipe")
        .then((rating) => {
          if (!rating) {
            return res.json({ recipe });
          }

          res.json({ recipe, rating });
          console.log("rating:", rating);
        });
    });
});

router.get("/:search", (req, res) => {
  const { search } = req.params;
  console.log("req.params:", req.params);
  // const filter = { title: search };
  // Recipe.find({ filter })
  //   .populate("owner")
  //   .then((results) => {
  //     if (!results) {
  //       return res.status(404).json({
  //         errorMessage: `No match found`,
  //       });
  //     }
  //     res.json({ results });
  //     console.log("results:", results);
  // });
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
  console.log("delete req.params:", req.params);
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
