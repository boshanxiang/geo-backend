//DEPENDENCIES
const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();

//MODELS IMPORT
const User = require('../models/users.js');

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
      res.redirect('/sessions/new')
    }
}

//MIDDLEWARE
    users.use(express.urlencoded({extended: true}));
    users.use(express.json());

//ROUTES
    users.get('/new', (req, res) => {
        res.render('./users/new_user.ejs', {currentUser: req.session.currentUser});
    })

    users.get('/login', (req, res) => {
        res.render('./users/login_user.ejs');
    })

    users.get('/:username', (req, res) => {
        User.findOne({username: req.params.username}, (error, foundUser) => {
            if(error) {
                console.log(error.message);
            } else if(!foundUser) {
                res.send('<a href="/reviews">No such user found</a>'); 
            } else {
                    let bookmarkIDs = foundUser.bookmarks;
                    Review.find({'_id': {$in: bookmarkIDs}}, (error, foundBookmarkedReviews) => {
                        if(error) {
                            console.log("bookmark push error: " + error.message)
                        } else {
                            let userReviewIDs = foundUser.userReviews;
                            Review.find({'_id': {$in: userReviewIDs}}, (error, foundUserReviews) => {
                                if(error) {
                                    console.log("userReview push error: " + error.message)
                                } else {
                                    res.render('./users/show_user.ejs', {
                                        pageTitle: `Userpage for ${req.params.username}`,
                                        user: req.params.username,
                                        bookmarks: foundBookmarkedReviews,
                                        userReviews: foundUserReviews,
                                        currentUser: req.session.currentUser
                                    });
                                }
                            })
                        }
                    })
            }
        })
    })

    users.post('/:id/upvote/:index', (req, res) => {
        User.find({username: req.session.currentUser.username}, (error, foundUser) => {
            if(error) {
                console.log(error);
            } else {
                if(!foundUser[0].upvotes.some((element) => (element == req.params.id))) {
                    req.session.currentUser.upvotes.push(req.params.id);
                    User.findOneAndUpdate({username: req.session.currentUser.username}, {$push: {upvotes: `${req.params.id}`}}, {new: true}, (error, foundUser) => {
                        if(error) {
                            console.log(error.message)
                        } else {
                            // ***
                            if(req.params.index === 'index') {
                                res.redirect('/reviews');
                            } else {
                                res.redirect(`/reviews/${req.params.id}`);
                            }
                        }
                    });
                    Review.findByIdAndUpdate(req.params.id, {$inc: {upvotes: 1}}, {new: true}, (error, upvotedReview) => {
                            if(error) {
                                console.log(error.message)
                            }
                        })
                    if(foundUser[0].downvotes.some((element) => (element == req.params.id))) {
                        req.session.currentUser.downvotes.splice(req.session.currentUser.downvotes.indexOf(req.params.id), 1);
                        User.findOneAndUpdate({username: req.session.currentUser.username}, {$pull: {downvotes: {$in: [req.params.id]}}}, {new: true}, (error, updatedUser) => {
                            if(error) {
                                console.log(error.message);
                            }
                        });
                        Review.findByIdAndUpdate(req.params.id, {$inc: {downvotes: -1}}, {new: true}, (error, downvotedReview) => {
                            if(error) {
                                console.log(error.message);
                            }
                        })
                    }

                } else if(foundUser[0].upvotes.some((element) => (element == req.params.id))) {
                    req.session.currentUser.upvotes.splice(req.session.currentUser.upvotes.indexOf(req.params.id), 1);

                    User.findOneAndUpdate({username: req.session.currentUser.username}, {$pull: {upvotes: {$in: [req.params.id]}}}, {new: true}, (error, updatedUser) => {
                        if(error) {
                            console.log(error.message)
                        } else {
                            // ***
                            if(req.params.index === 'index') {
                                res.redirect('/reviews');
                            } else {
                                res.redirect(`/reviews/${req.params.id}`);
                            }
                        }
                    })

                    Review.findByIdAndUpdate(req.params.id, {$inc: {upvotes: -1}}, {new: true}, (error, upvotedReview) => {
                        if(error) {
                            console.log(error.message)
                        }
                    })

                } else {
                    // ***
                    if(req.params.index === 'index') {
                        res.redirect('/reviews');
                    } else {
                        res.redirect(`/reviews/${req.params.id}`);
                    }
                }
            }
        });
    });

    users.post('/:id/downvote/:index', (req, res) => {
        User.find({username: req.session.currentUser.username}, (error, foundUser) => {
            if(error) {
                console.log(error);
            } else {
                if(!foundUser[0].downvotes.some((element) => (element == req.params.id))) {
                    req.session.currentUser.downvotes.push(req.params.id);
                    User.findOneAndUpdate({username: req.session.currentUser.username}, {$push: {downvotes: `${req.params.id}`}}, {new: true}, (error, foundUser) => {
                        if(error) {
                            console.log(error.message)
                        } else {
                            // ***
                            if(req.params.index === 'index') {
                                res.redirect('/reviews');
                            } else {
                                res.redirect(`/reviews/${req.params.id}`);
                            }                    }
                    });
                    Review.findByIdAndUpdate(req.params.id, {$inc: {downvotes: 1}}, {new: true}, (error, downvotedReview) => {
                            if(error) {
                                console.log(error.message)
                            }
                        })
                    if(foundUser[0].upvotes.some((element) => (element == req.params.id))) {
                        req.session.currentUser.upvotes.splice(req.session.currentUser.upvotes.indexOf(req.params.id), 1);
                        User.findOneAndUpdate({username: req.session.currentUser.username}, {$pull: {upvotes: {$in: [req.params.id]}}}, {new: true}, (error, updatedUser) => {
                            if(error) {
                                console.log(error.message);
                            }
                        });
                        Review.findByIdAndUpdate(req.params.id, {$inc: {upvotes: -1}}, {new: true}, (error, upvotedReview) => {
                            if(error) {
                                console.log(error.message);
                            }
                        })
                    }

                } else if(foundUser[0].downvotes.some((element) => (element == req.params.id))) {
                    req.session.currentUser.downvotes.splice(req.session.currentUser.downvotes.indexOf(req.params.id), 1);

                    User.findOneAndUpdate({username: req.session.currentUser.username}, {$pull: {downvotes: {$in: [req.params.id]}}}, {new: true}, (error, updatedUser) => {
                        if(error) {
                            console.log(error.message)
                        } else {
                            // ***
                            if(req.params.index === 'index') {
                                res.redirect('/reviews');
                            } else {
                                res.redirect(`/reviews/${req.params.id}`);
                            }                    }
                    })

                    Review.findByIdAndUpdate(req.params.id, {$inc: {downvotes: -1}}, {new: true}, (error, downvotedReview) => {
                        if(error) {
                            console.log(error.message)
                        }
                    })

                } else {
                    // ***
                    if(req.params.index === 'index') {
                        res.redirect('/reviews');
                    } else {
                        res.redirect(`/reviews/${req.params.id}`);
                    }            }
            }
        });
    });


    users.post('/:id/bookmark/:index', (req, res) => {
        User.find({username: req.session.currentUser.username}, (error, foundUser) => {
            if(error) {
                console.log(error.message);
            } else {
                if(!foundUser[0].bookmarks.some((element) => (element == req.params.id))) {
                    req.session.currentUser.bookmarks.push(req.params.id);
                    User.findOneAndUpdate({username: req.session.currentUser.username}, {$push: {bookmarks: `${req.params.id}`}}, {new: true}, (error, foundUser) => {
                        if(error) {
                            console.log(error.message)
                        } else {
                            // ***
                            if(req.params.index === 'index') {
                                res.redirect('/reviews');
                            } else {
                                res.redirect(`/reviews/${req.params.id}`);
                            }                    }
                    });
                } else {
                    req.session.currentUser.bookmarks.splice(req.session.currentUser.bookmarks.indexOf(req.params.id), 1);
                    User.findOneAndUpdate({username: req.session.currentUser.username}, {$pull: {bookmarks: `${req.params.id}`}}, {new: true}, (error, foundUser) => {
                        if(error) {
                            console.log(error.message)
                        } else {
                            // ***
                            if(req.params.index === 'index') {
                                res.redirect('/reviews');
                            } else {
                                res.redirect(`/reviews/${req.params.id}`);
                            }                    }
                    });
                }
            }
        });
    });

    users.post('/', (req, res) => {
        console.log(req.body);
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        req.body.upvotes = [];
        req.body.downvotes = [];
        req.body.bookmarks = [];
        req.body.userReviews = [];
        User.create(req.body, (err, createdUser) => {
            console.log('User is created', createdUser);
            req.session.currentUser = createdUser;
            res.redirect('/reviews');
        });
    })

module.exports = users;