const { Router } = require("express");
const upload = require("../middleware/cloudinary");
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

// router.patch(
//   "/updateRecipeImage",
//   isLoggedIn,
//   upload.single("recipeImage"),
//   (req, res) => {
//     const { userId } = req.body;
//     User.findByIdAndUpdate(
//       userId,
//       { recipeImage: req.file.path },
//       { new: true }
//     )
//       .then((updatedImage) => {
//         res.json({
//           success: true,
//           recipeImage: updatedImage.recipeImage,
//         });
//       })
//       .catch((err) => {
//         res.json({
//           success: false,
//           message: "CHECK IT OUT",
//         });
//       });
//   }
// );

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
//     });
// });

module.exports = router;
