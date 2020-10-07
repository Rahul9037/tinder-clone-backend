const express = require('express');
const router = express.Router();
const User = require('../Schemas/dbUsers');

router.get('/' , (req,res) => {
    User.find( (error,data) => {
        if(error)
        {
            res.status(400).send(error.message);
        }
        else
        {
            res.status(200).send(data);
        }
    });
});

module.exports = router;