const Users = require("../model/User");
const Profiles = require("../model/Profile");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;

exports.addUser = async (req, res) => {
  let { username, password, email } = req.body;
  try {
    let findUsername = await Users.findOne({ username });
    let findEmail = await Users.findOne({ email });
    if (findUsername || findEmail) {
      res.status(400).send({
        message: `Sorry the email or username has been taken, please create the other one !`,
        statusCode: 400,
      });
    } else {
      const userCreate = await Users.create({
        username,
        password,
        email,
      });
      // create data Profile database with (foreign-key)
      let { firstname, lastname, fullname, birthdate, address } = req.body;
      let userId = userCreate.id;
      let typeUser = "user";
      const createProfile = await Profiles.create({
        userId,
        firstname,
        lastname,
        fullname,
        birthdate,
        address,
        typeUser,
      });
      res.send({
        message: `Successfull to register your account`,
        resultData: { userCreate, createProfile },
        statusCode: 200,
      });
    }
    // create data Profile database with (foreign-key) end tags.
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { password } = req.body;
  let findUser = await Users.findOne({ password });
  if (!findUser) {
    res.status(400).send({
      message: "Failed to login. Invalid Password",
      statusCode: 400,
    });
  } else {
    try {
      let getProfile = await Profiles.findOne({ userId: findUser.id });
      let createToken = JWT.sign(
        {
          id: findUser._id,
          username: findUser.username,
          email: findUser.email,
          typeUser: getProfile.typeUser,
        },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.send({
        message: `Welcome ${findUser.username}`,
        sendData: {
          id: findUser.id,
          username: findUser.username,
          email: findUser.email,
          token: createToken,
          typeUser: getProfile.typeUser,
        },
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
};

exports.getUsersData = async (req, res) => {
  try {
    let userData = await Profiles.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);
    if (userData) {
      res.send({
        message: "Successfully to get user data",
        statusCode: "200",
        result: userData,
      });
    } else {
      res.status(401).send({ message: "Failed to get user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.getOneUserData = async (req, res) => {
  let userId = req.params.id;
  try {
    let userData = await Profiles.aggregate([
      { $match: { userId: ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);
    console.log(userData.length);
    if (userData.length !== 0) {
      res.send({
        message: "Successfully to get user data",
        statusCode: "200",
        result: userData,
      });
    } else {
      res.status(401).send({ message: "Failed to get user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  let { firstname, lastname, fullname, username, email, birthdate } = req.body;
  let userId = req.params.id;
  let findUser = await Users.findOne({ _id: ObjectId(userId) });
  if (findUser !== null) {
    try {
      let profileUpdate = await Profiles.updateOne(
        { userId: ObjectId(userId) },
        {
          $set: {
            firstname: firstname,
            lastname: lastname,
            fullname: fullname,
            birthdate: birthdate,
          },
        }
      );
      let userUpdate = await Users.updateOne(
        { _id: ObjectId(userId) },
        { $set: { username: username, email: email } }
      );
      if (req.body !== "") {
        res.send({
          message: `Successfull to Update User Data`,
          resultData: { profileUpdate, userUpdate },
          statusCode: 200,
        });
        return;
      } else {
        res.status(400).send({
          message: `Failed to Update User Data`,
          statusCode: 400,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).send({
      message: `Failed to Update User Data`,
      statusCode: 400,
    });
    return;
  }
};

exports.deleteUser = async (req, res) => {
  let userId = req.params.id;
  try {
    let dataUsers = await Users.deleteOne({ _id: ObjectId(userId) });
    let dataProfiles = await Profiles.deleteOne({ userId: ObjectId(userId) });
    console.log(dataUsers, dataProfiles);
    if (dataUsers.deletedCount !== 0 && dataProfiles.deletedCount !== 0) {
      res.send({
        message: "Successfull to Delete User Data",
        statusCode: 200,
        data: { dataUsers, dataProfiles },
      });
    } else {
      res.status(400).send({
        message: "Something went wrong, please try again later.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
