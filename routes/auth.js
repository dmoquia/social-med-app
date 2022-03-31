const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { sendgrid, EMAIL } = require("../config/keys");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: sendgrid,
    },
  })
);

router.post("/signup", async (req, res) => {
  try {
    const { name, password, email, pic } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: "User already exist" });
    } else {
      user = new User({
        name,
        password,
        email,
        pic,
      });
      transporter.sendMail({
        to: user.email,
        from: "dennis.moquia@gmail.com",
        subject: "signup success",
        html: "<h1>Welcome my Friend</h1>",
      });
      res.status(200).json({ msg: "successfully registered" });
    }
    // console.log(req.body);
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please enter password or email" });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ error: "invalid credential" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({ error: "invalid credential" });
    }
    // this code will generate token
    jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      {
        expiresIn: 36000,
      },
      (err, token) => {
        if (err) throw err;

        const { _id, name, email, followers, following, pic } = user;
        res.json({
          token,
          user: { _id, name, email, followers, following, pic },
        });
        // res.json({ token });
      }
    );
    // end of this code will generate token
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User does not exist with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 360000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "dennis.moquia@gmail.com",
          subject: "password reset",
          html: `<p>Your requested password reset. click on this link <a href="${EMAIL}/reset/${token}">to reset</a> </p>`,
        });

        res.json({ message: "check your email" });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashpassword) => {
        user.password = hashpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "password updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
