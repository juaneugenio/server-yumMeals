const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ratingSchema = new Schema(
  {
    rating: String,
    rater: { type: Schema.Types.ObjectId, ref: "User" },
    recipe: { type: Schema.Types.ObjectId, ref: "Recipe" },
    comment: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
