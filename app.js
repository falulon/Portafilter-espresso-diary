if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');

const flash = require('connect-flash');
const coffeesRoutes = require ('./routes/coffees');
const drinksRoutes =  require ('./routes/drinks');
const userRoutes = require ('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/coffeetypes'; 
const secret = process.env.SECRET || 'xhxnvnnadrugv!'

mongoose.connect(dbUrl, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
mongoose.set('useFindAndModify', false);



const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public')));
// // middleware to save POST data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(mongoSanitize({
    replaceWith: '_'
  }));


  //MongoStore - saves the session info into mongoDB
const store = new MongoStore ({
    url: dbUrl, 
    secret,
    touchAfter: 24 * 60 * 60 
})

store.on("error", function(e) {
    console.log("session store error", e);
})


const sessionConfig = {
    store,
    name: 'bamba',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 30 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 30 * 3
    }
}

app.set('trust proxy', true);

app.use(session(sessionConfig));
app.use(flash());

// app.use(helmet());
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());  //serialize = store it in the session, deserialize to unstore. 

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/coffees', coffeesRoutes);
app.use('/drinks', drinksRoutes);


// app.get('/', (req, res) => {
//     res.redirect('/coffees');
// });



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found 404', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log('Serving on port', port)
});
