const upload = require("../middleware/cloudinary");
const router = require("express").Router();
const User = require("../models/User.model.js");
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

router.delete("/:userId", isLoggedIn, (req, res) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId).then((deletedUser) => {
    res.json({ succes: true });
  });
});

module.exports = router;
