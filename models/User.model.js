const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    userImage: {
      type: String,
      default:
        "https://res.cloudinary.com/ilev/image/upload/v1638624728/Yummeals/Honey-Garlic-Shrimp-026_sdyuji.jpg",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
