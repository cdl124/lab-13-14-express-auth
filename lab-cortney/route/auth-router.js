'use strict';

const Router = require('express').Router;
const debug = require('debug')('authlab:auth-router');
const jsonParser = require('body-parser').json();
const parseBasicAuth = require('../lib/parse-basic-auth');

const authController = require('../controller/auth-controller');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, function(req, res, next){
  debug('POST /signup');
  authController.signup(req.body)
  .then( token => res.send(token))
  .catch(next);
});

authRouter.get('/signin', parseBasicAuth, function(req, res, next){
  authController.signin(req.auth)
  .then( token => res.send(token))
  .catch(next);
});
