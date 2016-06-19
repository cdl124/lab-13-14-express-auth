'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('authlab:handle-error');

// express error middleware gets called whenever next(err) is called with an error
module.exports = function(err, req, res, next){
  console.error(err.message);
  if (err.status && err.name){
    debug('http-error');
    res.status(err.status).send(err.name);
    next();
    return;
  }

  debug('server error');
  err = httpErrors(500, err.message);
  res.status(err.status).send(err.name);
};
