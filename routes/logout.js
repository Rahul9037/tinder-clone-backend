const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    if(req.session.user)
    {
        req.session.destroy();
        res.status(200).send(null);
    }
    else
    {
        res.status(200).send(req.session.user);
    }
})

module.exports = router;