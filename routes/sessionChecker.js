const express = require('express');
const router = express.Router();

router.get('/',(req,res) =>{
    if (req.session.user) {
        const user = req.session.user;
        res.status(200).send(user);
      }
      else {
          res.status(401).send('UnAutherised!!');
      }
})

module.exports = router;