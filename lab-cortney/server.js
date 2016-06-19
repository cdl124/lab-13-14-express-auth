'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('authlab:server');

const handleError = require('./lib/handle-error');
const authRouter = require('./route/auth-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/authlabdev';

mongoose.connect(mongoURI);

app.use(morgan('dev'));
app.use(handleError);

app.use('/api', authRouter);

app.all('*', function(req, res, next){
  debug('404 * route');
  next(httpErrors(404, 'no such route'));
});

const server = app.listen(port, function(){
  console.log('server started on port:', port);
});

server.isRunning = true;
module.exports = server;
