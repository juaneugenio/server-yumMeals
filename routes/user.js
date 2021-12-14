const upload = require("../middleware/cloudinary");
const router = require("express").Router();
const User = require("../models/User.model.js");
const Session = require("../models/Session.model");
const Recipe = require("../models/Recipe.model");
// const Rating = require("../models/Rating.model");
const isLoggedIn = require("../middleware/isLoggedIn");

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

router.delete("/:userId"),
  isLoggedIn,
  async (req, res) => {
    console.log("------>", req.user);
    const { userId } = req.params;
    const arrayUserRecipes = await Recipe.find({ owner: userId });
    const allUserRecipes = arrayUserRecipes.map((theRecipe) => theRecipe._id);

    const userSession = await Session.findById(req.headers.authorization).populate(
      "user"
    );

    if (req.user._id === req.session) {
      await Promise.all([
        User.findByIdAndDelete(userId),
        Recipe.deleteMany({ _id: { $in: allUserRecipes } }),
        Session.findByIdAndDelete(req.headers.authorization),
      ]);
    }
  };

module.exports = router;
