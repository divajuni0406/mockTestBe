const { model, Schema } = require("mongoose");

let userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
