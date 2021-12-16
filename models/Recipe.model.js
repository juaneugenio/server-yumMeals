const { Schema, model } = require("mongoose");
// import imagedefault from "../assets/default-image.jpg"

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    category: {
      type: String,
    },
    cookingTime: {
      type: String,
      // required: true,
    },
    ingredients: {
      type: [String],
    },
    stepsRecipe: {
      type: [String],
    },
    imageRecipe: {
      type: String,
      default:
        "https://res.cloudinary.com/ilev/image/upload/v1639332543/Yummeals/default-image_jzuzfn.jpg",
    },
  },
  // this second object adds extra properties: `createdAt` and `updatedAt`{
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
