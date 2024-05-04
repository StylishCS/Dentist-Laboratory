const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { genUID } = require("../utils/genUID");
async function signupUserController(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json("Email Address Already Exist");
    }
    user = new User({
      UID: await genUID(User),
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      buildNo: req.body.buildNo,
      floorNo: req.body.floorNo,
      address: req.body.address,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role,
      subscription: req.body.role === "LAB" ? new Date() : null,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;
    return res
      .status(201)
      .json({ user: userWithoutPassword._doc, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function loginUserController(req, res) {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json("Please Enter Valid Credentials");
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json("Wrong Username Or Password");
    }
    var currentDate = new Date();
    if (user.role == "LAB" && currentDate > user.subscription) {
      return res.status(403).json("Subscription Expired");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;
    return res
      .status(200)
      .json({ user: userWithoutPassword._doc, token: token });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { signupUserController, loginUserController };
