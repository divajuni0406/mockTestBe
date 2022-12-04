const { model, Schema } = require("mongoose");

let profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  fullname: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  typeUser: {
    type: String,
    require: true,
  },
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
