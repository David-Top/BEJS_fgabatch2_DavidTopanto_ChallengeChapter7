var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const prisma = require('./config/prisma/index')

const INDEX_ROUTES = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT;

prisma.$connect((err) => {
    if (err) {
        return console.log('Error Aquiring Client', err);
    }
    console.log('Connected to Database');
})

app.use(INDEX_ROUTES)

module.exports = app;
