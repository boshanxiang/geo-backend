const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');

sessions.post('/', (req, res) => {
    User.findOne({username: req.body.username}, (error, foundUser) => {
        if(error) {
            res.status(400).json({error: err.message});
        } else if (!foundUser) {
            res.status(400).json({error: 'No such user found'});
        } else {
            if(bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.status(200).json(foundUser);
            } else {
                res.status(400).json({error: err.message});
            }
        }
    });
});

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({message: 'Logged Out'});
    });
});

module.exports = sessions;