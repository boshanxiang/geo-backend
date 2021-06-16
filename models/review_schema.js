const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    rating: {type: Number, required: true},
    lat: {type: Number},
    lng: {type: Number},
    url: String,
    phone: String,
    email: String

}, {timestamps: true})


module.exports = mongoose.model('Review', reviewSchema);