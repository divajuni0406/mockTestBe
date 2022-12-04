const Mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await Mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });
    console.log("MongoDB has been connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
