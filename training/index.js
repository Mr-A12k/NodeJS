require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const login = require("./models/login");

const bodyParser = require("body-parser");
const Login = require("./models/login");
const app = express();
const router = express.Router();

const uri = "mongodb://localhost:27017/";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.once("open", () => {
  console.log("Connection...");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

// Test api used to check app is running
router.get("/test", (req, res) => {
  res.json({ message: "Successfully Working..." });
});

// This API is used add one record in Database
router.post("/addUser", async (req, res) => {
  const { userName, email, password } = req.body;

  // This findOne method used to find one record by unique field value (eg.email is unique)
  const loginInfo = await login.findOne({ email });

  // create new record if emailId is not exists
  if (!loginInfo) {
    const newUser = new login({
      userName,
      email,
      password: password,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Login Created...",
      statusCode: 200,
      userId: newUser._id,
    });
  }

  res.status(404).json({ message: "email Already Exist" });
});

router.get("/getOneUser/:userId", async (req, res) => {
  const { userId } = req.params;
  const usersData = await Login.findById(userId);
  const response = {
    name: usersData.userName,
    email: usersData.email,
  };
  res.json({ message: "Successfully Working...", data: response });
});

// This API is used to findAll data from Database
router.get("/getUsers", async (req, res) => {
  const usersData = await Login.find();
  res.json({ message: "Successfully Working...", data: usersData });
});

router.put("/updateUser/:userId", async (req, res) => {
  // unique id must for update record
  const { userId } = req.params;
  const { userName, email, password } = req.body;
  // these all details from body request
  const loginInfo = await login.findById(userId);

  // userDetails not found we can't edit so return this
  if (!loginInfo) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    const updateData = {
      userName,
      email,
      password: password,
    };
    // this method is used update one record
    await login.findByIdAndUpdate(userId, updateData);

    return res.status(201).json({
      message: "updated successfully...",
      statusCode: 200,
      updatedData: updateData,
    });
  }
});

router.delete("/deleteUser/:userId", async (req, res) => {
  // unique id must for update record
  const { userId } = req.params;

  const loginInfo = await login.findById(userId);
  if (!loginInfo) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    // this method is used to delete one record
    await Login.findByIdAndDelete(userId);
    return res.status(201).json({
      message: "User delted successfully...",
      statusCode: 200,
    });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});