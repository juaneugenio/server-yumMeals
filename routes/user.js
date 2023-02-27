const upload = require("../middleware/cloudinary");
const router = require("express").Router();
const User = require("../models/User.model.js");
const Session = require("../models/Session.model");
const Recipe = require("../models/Recipe.model");
// const Rating = require("../models/Rating.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.patch("/edit-profile", isLoggedIn, (req, res) => {
  const { username } = req.body;
  const { _id } = req.user;

  if (username === _id.username) {
    return res.json({ user: req.user });
  }

  User.findOne({ username }).then((foundedUser) => {
    if (foundedUser) {
      return res
        .status(400)
        .json({ errorMessage: "Username already exit. Insert another one" });
    }

    User.findByIdAndUpdate(_id, { username }, { new: true }).then((updatedUser) => {
      // console.log("CL 👉---", updatedUser);
      res.json({ user: updatedUser });
    });
  });
});

//method .single. it expect a fiel name which the value is a string. it`s the fiel name of our form that it will hold our image
router.patch(
  "/updateProfileImage",
  isLoggedIn,
  upload.single("profileImage"),
  (req, res) => {
    const { userId } = req.body;
    User.findByIdAndUpdate(userId, { profileImage: req.file.path }, { new: true })
      .then((updatedUser) => {
        res.json({
          success: true,
          profileImage: updatedUser.profileImage,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          message: "CHECK IT OUT",
        });
      });
  }
);

//Deleting user

// router.delete("/:userId", isLoggedIn, (req, res) => {
//   const { userId } = req.params;

//   User.findByIdAndDelete(userId).then((deletedUser) => {
//     res.json({ succes: true });
//   });
// });

router.delete("/:userId", isLoggedIn, async (req, res) => {
  const { userId } = req.params;
  const arrayUserRecipes = await Recipe.find({ owner: userId });
  console.log("ARRAY RECIPES", arrayUserRecipes);
  const allUserRecipes = arrayUserRecipes.map((theRecipe) => theRecipe._id);
  console.log("ARRAY ALL RECIPES", allUserRecipes);

  // const userSession = await Session.findById(req.headers.authorization).populate(
  //  "user")

  const userSession = req.headers.authorization;

  const deleteUser = await Session.findById(userSession).populate("user");

  if (deleteUser.user._id.toString() !== userId) {
    console.log("We are here--", deleteUser.user._id.toString());
    return res.status(404).json({
      errorMessage: "You are not aloud to do this",
    });
  }

  await Promise.all([
    Recipe.deleteMany({ _id: { $in: allUserRecipes } }),
    User.findByIdAndDelete(userId),
    Session.findByIdAndDelete(req.headers.authorization),
  ]);
  return res.status(200).json({ message: "All good" });
});

module.exports = router;
