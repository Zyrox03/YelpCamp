if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()

}


const express = require('express');
const router = express.Router();
const { validateCampground, isLoggedIn, isAuthor } = require('../Middlewares');

const multer = require('multer')
const { storage } = require('../cloudinary')

const upload = multer({ storage })

const campground = require('../controllers/campgrounds')

router.route('/')
    .get(campground.AllCampgrounds)
    .post(isLoggedIn, upload.array('image'), validateCampground, campground.createNewCampground)


router.get('/new', isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(campground.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, campground.editCampground)
    .delete(isLoggedIn, isAuthor, campground.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campground.renderEditFrom)




module.exports = router;