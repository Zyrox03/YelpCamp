const Campground = require('../models/campground');
const Review = require('../models/reviews');
const catchAsync = require('../utilis/catchAsync');

module.exports.redirectShowCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.redirect(`/campgrounds/${campground._id}`);


})


module.exports.addReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    review.author = req.user
    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, revID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revID } });
    await Review.findByIdAndDelete(revID);

    res.redirect(`/campgrounds/${id}`);
})

