const route = require("express").Router();

const {
  addUser,
  login,
  getUsersData,
  getOneUserData,
  updateUser,
  deleteUser,
} = require("../controller/UserController");

route.get("/get-users-data", getUsersData);
route.get("/get-user-data/:id", getOneUserData);
route.post("/add-user", addUser);
route.post("/login", login);
route.put("/update-user/:id", updateUser);
route.delete("/delete-user/:id", deleteUser);

module.exports = route;
