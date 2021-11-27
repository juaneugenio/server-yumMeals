const router = require("express").Router();
const authRoutes = require("./auth");
const recipesRoutes = require("./recipes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/recipes", recipesRoutes);

module.exports = router;
