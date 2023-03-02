
const User = require('../models/user')
const catchAsync = require('../utilis/catchAsync');


module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register', { title: 'Register' });
  }
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login', { title: 'Login' });
  }

module.exports.registerUser = catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const regUser = await User.register(user, password);
  
      req.login(regUser, function (err) {
        if (err) { return next(err); }
        req.flash('success', 'welcome to YelpCampZyrox');
        res.redirect('/campgrounds');
      });
  
  
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register');
    }
  
  })
module.exports.loginUser = catchAsync( async(req, res) => {
    req.flash('success', 'Welcome BACK !');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

  })


  module.exports.logoutUser  = catchAsync(async(req, res) => {
    req.logout(function (err) {
      if (err) { return next(err); }
      req.flash('success', 'logged out !')
      res.redirect('/campgrounds')
    });
  
  })