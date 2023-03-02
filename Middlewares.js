const ExpressError = require('./utilis/ExpressError');
const { campgroundSchema, reviewSchema } = require('./JOISchema')
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const user = require('./models/user');


module.exports.validateCampground = (req, res, next) => {


  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 404)

  } else {
    next()
  }
}
module.exports.validateReview = (req, res, next) => {


  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 404)

  } else {
    next()
  }
}


module.exports.isLoggedIn = (req,res,next)=>{

  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl

  req.flash('error','You must be signed in first');
  return res.redirect('/login');
}
next()
}





module.exports.isAuthor = async(req,res,next)=>{
  const { id } = req.params
  const campground = await Campground.findById(id)
  if(!campground.author.equals(req.user._id)){
      req.flash('error',"You don't have permission to do that !")
      return res.redirect(`/campgrounds/${id}`);

  }
  next()
}


module.exports.isReviewAuthor = async(req,res,next)=>{
  const { id , revID} = req.params
  const review = await Review.findById(revID)
  if(!review.author.equals(req.user._id)){
      req.flash('error',"You don't have permission to delete that !")
      return res.redirect(`/campgrounds/${id}`);

  }
  next()
}