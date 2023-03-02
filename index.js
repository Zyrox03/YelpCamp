const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');

var methodOverride = require('method-override');
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const ExpressError = require('./utilis/ExpressError');
const User = require('./models/user')
const session = require('express-session')
const flash = require('connect-flash')
const helmet = require('helmet');

const MongoStore = require('connect-mongo');

const passport = require('passport');
const passportLocal = require('passport-local');

const dbUrl = "mongodb://127.0.0.1:27017/ZyroxCamp"
mongoose.set('strictQuery', true);
main().catch(err => console.log(err));



async function main() {
  // LOCALHOST => 'mongodb://127.0.0.1:27017/ZyroxCamp'
   mongoose.connect(dbUrl);
  console.log('SERVING DATABASE !')
}


app.engine('ejs', engine);
app.set('views', path.join(__dirname) + '/views')
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(flash())

app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);



const sessionConfig = {
  name : "session",
  secret: 'Supersecretsecret',
  store: MongoStore.create({ mongoUrl: dbUrl , touchAfter: 24 * 3600  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure : true
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
}

} 
app.use(session(sessionConfig));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
 
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",

];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://cdn.jsdelivr.net/",

];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})



app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('homePage', { title: 'Home' });
})




app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err, title: 'ERROR' })
})






app.listen(3000, () => {
  console.log('LISTENING TO PORT 3000 !');
})