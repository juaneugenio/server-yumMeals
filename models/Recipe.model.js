const { Schema, model } = require("mongoose");

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
    // cookingTime: {
    //   type: Number,
    //   required: true,
    // },
    ingredients: {
      type: [String],
    },
    stepsRecipe: {
      type: [String],
    },
    // images: {
    //   type: String,
    //   default: "PUT A DEFAULT URL OR WHATEVER",
    // },
    // //! HOW CAN WE LINK EACH RATING TO THE USER WHO MAKES THE RATING
    // ratings: [
    //   { rating: Number, user: { type: Schema.Types.ObjectId, ref: "User" } },
    // ],
  },
  // this second object adds extra properties: `createdAt` and `updatedAt`{
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
