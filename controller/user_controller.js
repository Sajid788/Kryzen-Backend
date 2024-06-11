const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user_model");
require("dotenv").config();

// Register a new user
const userRegister = async (req, res) => {
  const { username, email, password} = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please fill all the details!!" });
  }

  try {
    // Here we are checking if the user already exists
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        message: "User already exists. Please login!",
      });
    }

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      try {
        // Here create a new user and  hash the password
        const user = await UserModel.create({
          username: username,
          email: email,
          password: hash,
      
        });
        res.json({ message: "User signed up successfully", user });
      } catch (error) {
        if (error.username === "ValidationError") {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the details" });
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!email) {
      return res.status(400).json({
        message: "User does not exist. Please Signup!",
      });
    }
    // Compare the password
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.json({
          message: "login succcessful",
          userData: {
            username: user.username,
            token: token,
          },
        });
      } else {
        return res.status(400).json({
          message: "Wrong credentials!",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { userRegister, userLogin, getUserDetails};
