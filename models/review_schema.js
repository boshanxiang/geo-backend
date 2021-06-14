const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    rating: {type: Number, required: true},
    location: {type: String, required: true},
    address: String,
    url: String,
    phone: String,
    email: String

}, {timestamps: true})


module.exports = mongoose.model('Review', reviewSchema);