const express             = require('express');
const app                 = express();
const port                = process.env.PORT || 8000;
// const port                = process.env.PORT || 80;
const mongoose            = require('mongoose');
const passport            = require('passport');
const flash               = require('connect-flash');
const expressLayouts      = require('express-ejs-layouts');
const path                = require('path');

const morgan              = require('morgan');
const cookieParser        = require('cookie-parser');
const bodyParser          = require('body-parser');
const session             = require('express-session');

const configDB            = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(session({
    secret: 'awesomeness',
    name: 'TheCookie',
    proxy: true,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on bogdanb.udevoffice.com');
// vm IP -> 146.185.178.206