const express = require('express');
const reviews = express.Router();

const Review = require('../models/review_schema.js');
const seedReviews = require('../models/seed_reviews.js')

// SEED ROUTE

/*
curl -H 'Origin: http://localhost:3000' 'http://localhost:3003/reviews/seed'
*/

reviews.get('/seed', async(req, res) => {
    try{
        const plantReviews = await Review.create(seedReviews);
        res.redirect('/');
    } catch (err) {
        res.send(err.message);
    }
});

    
//JSON ROUTE

reviews.get('/json', (req, res) => {
        Review.find({}, (error, allReviews) => {
            res.redirect('/');
        });
    });

    
// INDEX ROUTE

/*
curl -H 'Origin: http://localhost:3000' 'http://localhost:3003/reviews'
*/

reviews.get('/', (req, res) => {
    Review.find({}, (err, foundReviews) => {
        if(err) {
            res.status(400).json({error: err.message});
        } else {
            res.status(200).json(foundReviews);
        }
    });
});

// CREATE ROUTE

/*
curl -X POST \
    -H 'Origin: http://localhost:3000' \
    -H "Access-Control-Request-Headers: X-Requested-With" \
    -H "Content-Type: application/json" \
    -d '{"name":"Phil's Patisserie", "description":"Not bad!", "rating":"4", "location":"57385"}' \
    'http://localhost:3003/reviews' \

*/


reviews.post('/', (req, res) => {
    Review.create(req.body, (err, createdReview) => {
        if(err) {
            res.status(400).json({error: err.message});
        } else {
            res.status(200).json(createdReview);
        }
    });
});

// PUT ROUTE

/*
curl -X PUT \
    -H 'Origin: http://localhost:3000' \
    -H "Content-Type: application/json" \
    -d '{"name":"Phil's Patisserie", "description":"Not bad!", "rating":"4", "location":"99999"}' \
    'http://localhost:3003/reviews/[ID]'
*/

reviews.put('/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedReview) => {
        if(err) {
            res.status(400).json({error: err.message});
        } else {
            res.status(200).json(updatedReview);
        }
    });
});

// DELETE ROUTE

/*
curl -X DELETE \
    -H 'Origin: http://localhost:3000' \
    'http://localhost:3003/reviews/[ID]'
*/

reviews.delete('/:id', (req, res) => {
    Review.findByIdAndRemove(req.params.id, (err, deletedReview) => {
        if(err) {
            res.status(400).json({error: err.message});
        } else {
            res.status(200).json({
                'deleted_review': deletedReview
            });
        }
    });
});


module.exports = reviews