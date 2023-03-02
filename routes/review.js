const express = require('express');
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn, isReviewAuthor } = require('../Middlewares');


const review = require('../controllers/reviews')

router.route('/')
    .get(review.redirectShowCampground)
    .post(isLoggedIn, validateReview, review.addReview)

router.route('/:revID')
    .get(review.redirectShowCampground)
    .delete(isLoggedIn, isReviewAuthor, review.deleteReview)


module.exports = router;
