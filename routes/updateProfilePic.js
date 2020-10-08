const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require('../Schemas/dbUsers');
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myfile");

router.post('/' ,  (req,res) => {
    upload(req,res , async () => {
        const email = req.body.email;
        const file = req.file;
        const resp = await User.updateOne({ email : email} ,
            { $set: { profile : file } })
        if(resp.n === 1)
        {
            User.findOne({email : email} , (error,data) =>{
                if(error){
                    res.status(400).send(error.message);
                }
                else{
                    res.status(200).send(data);
                }
            })
        }
        else
        {
            res.status(400).send('Image Upload Failed!!!');
        }
        
    })
})

module.exports = router;
