'use strict';

// auth-controller takes a req.body containing a new username and password,
// utilizes the User model to ensure unique username and hash,
// then sends user a token of... authenticity? for what?

const debug = require('debug')('authlab:auth-controller');

const User = require('../model/user');

exports.signup = function(reqBody){
  debug('signup');
  return new Promise((resolve, reject) => {
    var password = reqBody.password;
    delete reqBody.password; // so... we're deleting the user's pw right off the bat?
    var user = new User(reqBody);
    user.generateHash(password) // hash pw so to not save in plaintext
    .then( user => user.save()) // save the user to ensure unique username
    .then( user => user.generateToken()) // generate token to send to user
    .then( token => resolve(token)) // resolve token
    .catch(reject);
  });
};

exports.signin = function(auth){
  return new Promise((resolve, reject) => {
    User.findOne({username: auth.username})
    .then( user => user.compareHash(auth.password))
    .then( user => user.generateToken())
    .then( token => resolve(token))
    .catch(reject);
  });
};
