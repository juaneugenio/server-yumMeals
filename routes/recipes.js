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
  console.log(`LOOOOOOOOOOOK`, req.headers);
  Recipe.create({
    owner: req.user._id,
    title: req.body.title,
    // image: req.file.path,
  })
    .then((createRecipe) => {
      res.json({ recipes: createRecipe });
    })
    .catch((e) => {
      res.json({ recipes: {} });
    });
});

module.exports = router;
