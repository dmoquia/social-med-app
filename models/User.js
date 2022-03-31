const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dqbcudtfg/image/upload/v1648023639/default-pic_jxasx5.png",
  },
  followers: [{ type: ObjectId, ref: "user" }],
  following: [{ type: ObjectId, ref: "user" }],
});

mongoose.model("user", userSchema);
