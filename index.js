const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes/user");

const serverless = require("serverless-http");

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/.netlify/functions/api", router);

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});

const connectionMongoDB = require("./config/connection");
connectionMongoDB();

module.exports.handler = serverless(app);
