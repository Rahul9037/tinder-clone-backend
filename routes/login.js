const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Schemas/dbUsers");
const client = require("twilio")(process.env.accountSID, process.env.authToken);
require("dotenv/config");

router.post("/", async (req, res) => {
  const loginDetails = req.body;
  let userDetails = null;
  const user = await User.findOne({ email: loginDetails.email });
  if (user) {
    bcrypt
      .compare(loginDetails.password, user.password)
      .then(function (hash) {
        if (hash) {
          req.session.user = user._id;
          userDetails = {
            name: user.name,
            email: user.email,
            age: user.age,
            phone: user.phone,
            profile: user.profile,
          };
          res
            .status(200)
            .send({ msg: "Login Successfull!", userdetails: userDetails });
        } else {
          res.status(200).send({ msg: "Please check the credentials!!" });
        }
      })
      .catch((error) => res.status(500).send(error.message));
  } else {
    res.status(200).send({ msg: "User not found!" });
  }
});

router.post("/phone", async (req, res) => {
  const phoneValidationDetails = req.body;
  const user = await User.findOne({
    phone: phoneValidationDetails.phonenumber,
  });
  if (user) {
    client.verify
      .services(process.env.serviceID)
      .verifications.create({
        to: phoneValidationDetails.phonenumber,
        channel: phoneValidationDetails.channel,
      })
      .then((data) => {
        res.status(200).send({ msg: "OTP Sent Successfully!" });
      })
      .catch((error) => res.status(500).send(error.message));
  } else {
    res.status(400).send("Not found!");
  }
});

router.post("/phone-verify", async (req, res) => {
  const phoneValidationDetails = req.body;
  let approved = false;
  let userDetails = null;
  client.verify
    .services(process.env.serviceID)
    .verificationChecks.create({
      to: phoneValidationDetails.phonenumber,
      code: phoneValidationDetails.code,
    })
    .then((data) => {
      if (data.status === "approved") {
        approved = true;
      } else {
        approved = false;
      }
    })
    .catch((error) => res.status(500).send(error.message));
  if (approved) {
    const user = await User.findOne({
      phone: phoneValidationDetails.phonenumber,
    });
    if (user) {
      req.session.user = user._id;
      userDetails = {
        name: user.name,
        email: user.email,
        age: user.age,
        phone: user.phone,
        profile: user.profile,
      };
      res
        .status(200)
        .send({ msg: "Login Successfull!", userdetails: userDetails });
    } else {
      res.status(200).send({ msg: "User not found!" });
    }
  }
  else
  {
    res.status(200).send({ msg: "Wrong OTP!! Couldnot verify user!" });
  }
});

module.exports = router;
