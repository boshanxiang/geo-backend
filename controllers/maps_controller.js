const express = require('express');
const reviews = express.Router();

const Review = require('../models/review_schema.js');
const seedReviews = require('../models/seed_reviews.js')

module.exports = reviews