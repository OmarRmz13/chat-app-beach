const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  user: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  photo: {
    type: String,
    default: "noImage.jpg",
    required: false,
  },
  description:{
      type: String,
      default: "No description :)",
      required:false
  },
  convertations:[{
    type: Schema.Types.ObjectId,
    ref:'convertation',
    required:false,
  }]
});

module.exports = mongoose.model("User", userSchema);
