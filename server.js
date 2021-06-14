// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const APP = express();
const PORT = 3003;

// MIDDLEWARE
APP.use(express.json())

// SET UP MONGO CONNECTION
mongoose.connect('mongodb://localhost:27017/reviews', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
    console.log('Connected to Mongo');
});

// CONFIGURE CORS MIDDLEWARE
const herokuWhitelist = '' // TO UPDATE WITH HEROKU URL WHEN AVAILABLE
const whitelist = ['http://localhost:3000', herokuWhitelist]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

APP.use(cors(corsOptions))

// USE REVIEWS CONTROLLER

const reviewsController = require('./controllers/reviews_controller.js');
APP.use('/reviews', reviewsController);


// APP listening
APP.listen(PORT, () => {console.log('Listening on port ', PORT)});