// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//USER AUTHENTICATION DEPENDENCIES
const dotenv = require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

//CONNECTION CONFIGURATIONS
const APP = express();
const PORT = process.env.PORT || 3000;
const MONGODB = process.env.MONGODB;


// MIDDLEWARE
APP.use(express.urlencoded({ extended: true }));
APP.use(express.json());
APP.use(methodOverride('_method'));
APP.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUnitialized: false
    })
)

// SET UP MONGO CONNECTION
mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

// USE  CONTROLLERS

//Reviews Controller
const reviewsController = require('./controllers/reviews_controller.js');
APP.use('/reviews', reviewsController);

//Users Controller
const userController = require('./controllers/users_controller.js');
APP.use('/users', userController);

//Sessions Controller
const sessionsController = require('./controllers/sessions_controller.js');
APP.use('/sessions', sessionsController);

//Maps Controller
const mapsController = require('./controllers/maps_controller.js')
APP.use("/maps", mapsController)

// APP listening
APP.listen(PORT, () => { console.log('Listening on port ', PORT) });