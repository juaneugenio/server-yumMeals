/** @format */

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
		profileImage: {
			type: String,
			default: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0",
		},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	},
);

const User = model("User", userSchema);

module.exports = User;
