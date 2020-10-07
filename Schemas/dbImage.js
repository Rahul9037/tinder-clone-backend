import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
    meta_data:{}
});

module.exports = mongoose.model('image' , imageSchema)