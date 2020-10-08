const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Schemas/dbUsers');
const client = require("twilio")(process.env.accountSID, process.env.authToken);
require("dotenv/config");

router.post('/' , (req,res) => {
    const userDetails = req.body;
    bcrypt.hash(userDetails.password , 10)
    .then(hash => {
        userDetails.password = hash;
        User.create( userDetails , (error,data) => {
            if(error)
            {
                res.status(400).send(error.message);
            }
            else
            {
                req.session.user = data;
                res.status(201).send(data);
            }
        })
    })
    .catch(error => res.status(400).send(error.message));
});

router.post('/phone' , (req,res) => {
    const phoneValidationDetails = req.body;
    client.verify
      .services(process.env.serviceID)
      .verifications
      .create({
        to: phoneValidationDetails.phonenumber,
        channel: phoneValidationDetails.channel,
      })
      .then((data) => {
        res.status(200).send("OTP Sent Successfully!");
      })
      .catch((error) => res.status(400).send(error.message));
});

router.post('/verify' , (req,res) => {
    const phoneValidationDetails = req.body;
    client.verify
      .services(process.env.serviceID)
      .verificationChecks
      .create({
        to: phoneValidationDetails.phonenumber,
        code: phoneValidationDetails.code,
      })
      .then((data) => {
        res.status(200).send(data.status);
      })
      .catch((error) => res.status(400).send(error.message));
})

module.exports = router;