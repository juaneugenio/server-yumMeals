const router = require("express").Router();
const authRoutes = require("./auth");
const recipesRoutes = require("./recipes");
const upload = require("../middleware/cloudinary");
const User = require("../models/User.model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//sending and updating the profile pic
//single method: expect a fill name that will hold our image
router.post(
  "/user/updateProfilePic",
  upload.single("profilePic"),
  (req, res) => {
    const { userId } = req.body;
    User.findByIdAndUpdate(userId, { profilePic: req.file.path }, { new: true })
      .then((UpdatedUser) => {
        res.json({
          success: true,
          profilePic: UpdatedUser.profilePic,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          message: "server issue",
        });
      });
  }
);

router.use("/auth", authRoutes);
router.use("/recipes", recipesRoutes);

module.exports = router;
