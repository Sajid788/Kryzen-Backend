const express = require("express");
const { userRegister, userLogin, getUserDetails} = require("../controller/user_controller");

const userRouter = express.Router();

userRouter.post("/register", userRegister);

userRouter.post("/login", userLogin);

userRouter.get("/:username", getUserDetails);

module.exports = { userRouter };
