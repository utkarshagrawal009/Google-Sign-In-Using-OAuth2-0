const express = require('express');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // a day in ms
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodbURI.dbURI, ()=>{
    console.log('connected to mongodb');
});
/*mongoose 
 .connect(keys.mongodbURI.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));*/

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});