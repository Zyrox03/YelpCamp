const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });


const user = require('../controllers/users')

// register
router.route('/register')
    .get(user.renderRegisterForm)
    .post(user.registerUser)

// login
router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), user.loginUser);

// logout

router.get('/logout', user.logoutUser)


module.exports = router