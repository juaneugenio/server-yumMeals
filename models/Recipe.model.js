const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  stepsRecipe: {
    type: [String],
    required: true,
  },
  images: {
    type: String,
    default: "PUT A DEFAULT URL OR WHATEVER",
  },
  //HOW CAN WE LINK EACH RATING TO THE USER WHO MAKES THE RATING
  ratings: {
    type: Number,
    default: [0],
  },
  // this second object adds extra properties: `createdAt` and `updatedAt`
  timestamps: true,
});

const User = model("User", userSchema);

module.exports = User;
