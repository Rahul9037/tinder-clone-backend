const express = require('express');
const router = express.Router();
const User = require("../Schemas/dbUsers");

router.get('/', async (req,res) =>{

    if (req.session.user) {
        const user_id = req.session.user;
        const user = await User.findOne({ _id : user_id });
        if (user) {
            req.session.user = user._id;
            userDetails = {
              name: user.name,
              email: user.email,
              age: user.age,
              phone: user.phone,
              profile : user.profile
            };
            res.status(200).send({ msg : "Login Successfull!", userdetails : userDetails });
          } else {
            res.status(200).send({msg : "User not found!"});
          }
      }
      else {
          res.status(200).send({msg : "User not found! Please Login !"});
      }
})

module.exports = router;