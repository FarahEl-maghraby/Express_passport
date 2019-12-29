var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var config = require('./config/database');
const eventsRouter = require('./routes/eventapi')
const adminAuth = require ('./routes/adminAuth')
const userAuth = require ('./routes/userAuth')
const userRouter = require ('./routes/userapi')
const userProfile = require('./routes/userEvents')

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true });

var app = express();



app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());


app.use('/admin', adminAuth);
app.use('/admin',eventsRouter);
app.use ('/admin',userRouter);
app.use('/user', userAuth);
app.use('/profile',userProfile)


module.exports = app;
