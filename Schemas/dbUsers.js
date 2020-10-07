const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    age : String,
    phone : String,
    profile : {}
})

module.exports = mongoose.model('users' , userSchema);