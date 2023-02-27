//CRUD operation

const { Router } = require("express");
const router = Router();

// const upload = require("../middleware/cloudinary");
const isLoggedIn = require("../middleware/isLoggedIn");
const Rating = require("../models/Rating.model");
const Recipe = require("../models/Recipe.model");

router.get("/", (req, res) => {
  Recipe.find({}).then((allRecipes) => {
    res.json({ recipes: allRecipes });
  });
});

//upload.single("juanPostPic")
router.post(
  "/create",
  isLoggedIn,
  upload.single("imageRecipePic"),
  (req, res) => {
    console.log("REQ.FILE", req);
    Recipe.create({
      owner: req.user._id,
      title: req.body.title,
      category: req.body.category,
      ingredients: req.body.ingredients,
      cookingTime: req.body.cookingTime,
      stepsRecipe: req.body.stepsRecipe,
      imageRecipe: req.file.path,
    })
      .then((createRecipe) => {
        console.log(createRecipe);
        res.json({
          recipe: createRecipe,
        });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ errorMessage: "Something fed up" });
      });
  }
);

router.get("/:recipeId", withUser, (req, res) => {
  console.log("authorization:", req.headers.authorization);
  const sessionId = req.headers.authorization;
  console.log("sessionId:", sessionId);
  console.log("req.user:", req.user);
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
      console.log("THIS IS A RECIPE", recipe);
      if (!recipe) {
        return res.status(404).json({
          errorMessage: `The recipe with this id ${recipeId} does not exist`,
        });
      }
      recipeIsRated = false;
      Rating.find({ recipe: recipeId, rater: { $eq: req.user?._id } }).then(
        (isUserRated) => {
          if (isUserRated) {
            return (recipeIsRated = true);
          }
        }
      );

      // We search all ratings for all user except the current user
      Rating.find({ recipe: recipeId, rater: { $ne: req.user?._id } })
        .populate("rater recipe")
        .then((rating) => {
          if (!rating) {
            return res.json({ recipe });
          }

          res.json({ recipe, rating, recipeIsRated });
          console.log("GET SINGLE RECIPE RATINGS:", rating);
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ errorMessage: "Something fed up" });
    });
});

router.get("/rating/:recipeId", isLoggedIn, DynamicRecipe, (req, res) => {
  const { recipeId } = req.params;
  console.log("req.params:", recipeId);
  console.log("req.user:", req.user);

  recipeIsRated = false;

  Rating.find({ recipe: recipeId, rater: { $eq: req.user?._id } })
    // .populate("rater recipe")
    .then((oneRating) => {
      if (!oneRating) {
        return;
      }
      recipeIsRated = true;
      console.log("GET USER RATING:", oneRating);
      res.json({ oneRating, recipeIsRated });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ errorMessage: "Something fed up" });
    });
});

router.post("/rating/:recipeId", isLoggedIn, (req, res) => {
  // console.log(`LOOOOOOOOOOOK`, req.headers);
  console.log(`reqbody`, req.body);
  console.log("REQ.PARAMS:", req.params);
  Rating.create({
    rater: req.user._id,
    recipe: req.params.recipeId,
    rating: req.body.userRating,
    comment: req.body.comment,
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

// Updating Recipe, similiar as Deleting goes to related handleUpdateRecipe in the recipeService frontend.

router.put("/edit/:recipeId", isLoggedIn, (req, res) => {
  const { recipeId } = req.params;
  console.log("params", req.params);
  // const { owner } = req.user._id;
  const { title, category, ingredients, stepsRecipe, cookingTime } = req.body;
  const newRecipe = { title, category, ingredients, stepsRecipe, cookingTime };

  Recipe.findByIdAndUpdate(recipeId, newRecipe, { new: true })
    .then((updatedRecipe) => {
      console.log({ updatedRecipe });
      res
        .status(200)
        .json({ message: `Recipe ${updatedRecipe} was succesful updated` });
    })
    .catch((error) =>
      res.status(500).json({ message: "Something went wrong" })
    );
});

// router.get("/:id/edit", isLoggedIn, (req, res) => {
//   const { id } = req.params;
//   // console.log(req.params);

// router.patch("/:id/edit", isLoggedIn, (req, res) => {
//   const { id } = req.params;
//   const { title, category, ingredients, stepsRecipe, cookingTime } = req.body;

//   Recipe.findById(id)
//     .populate("owner")
//     .then((recipe) => {
//       console.log("this is ", recipe);
//       if (!recipe) {
//         return res
//           .status(404)
//           .json({ errorMessage: `Recipe with the id ${id} does not exist` });
//       }
//       //     // compare here
//       // if (req.user._id === req.recipe.owner)
//       //we have to get the check the Spider for this.

//       // Recipe.findByIdAndUpdate(
//       //   id,
//       //   { title, category, ingredients, stepsRecipe, cookingTime },
//       //   // {
//       //   //   title: req.body.title,
//       //   //   category: req.body.category,
//       //   //   ingredients: req.body.ingredients,
//       //   //   stepsRecipe: req.body.stepsRecipe,
//       //   // },
//       //   { new: true }
//       // ).then((newRecipe) => {
//       //   res.json({ recipe: newRecipe });
//       // });
//     });
// });

module.exports = router;
