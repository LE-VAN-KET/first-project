require('dotenv').config();
const cors = require('cors');

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
const adminRoute = require('./routes/adminRoute');
const methodOverride = require('method-override');
const flash        = require('connect-flash');
const passport = require('passport');
const localStrategy		=	require('passport-local').Strategy;
const expressValidator = require('express-validator');

const options = {
	host: 'localhost',
	port: 3306,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ClearExpired : true ,
  checkExpirationInterval: process.env.MAX_AGE,
  expiration: 86400000,
  createDatabaseTable: true,
  connectionLimit: 1,
  endConnectionOnClose: true,
  charset: 'utf8_unicode_ci',
  schema: {
    tableName: 'sessions',
    columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
    }
}
};

const connection = mysql.createConnection(options); // or mysql.createPool(options);
const sessionStore = new MySQLStore({}/* session store options */, connection);

const app = express();
const SESS_LIFETIME = 1000*60*60;//TOW_HOURS
const IN_PROD = process.env.NODE === 'production';


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser(process.env.SESSTION_SECRET));

app.use(methodOverride('_method'));

app.use(session({
  // name: process.env.SESS_NAME,
  key: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSTION_SECRET,
  store: sessionStore,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}));
//passport
app.use(passport.initialize());
app.use(passport.session()); 

app.use(flash());
app.use(function(req,res,next) {
	res.locals.messages = require('express-messages')(req,res);
	next();
});

app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('*', function(req,res,next) {
	//local variable to hold user info
	res.locals.user = req.user ||  null;
	next();
});

app.get('/', (req, res) => {
  res.redirect('/admin');
});

app.use('/admin', adminRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
