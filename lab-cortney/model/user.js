'use strict';

// the User model defines the username, password, fundHash properties,
// then establishes Promises for the controller to generate a hash,
// compare a password to a hash, then once that's successful,
// a JSON web token is generated.

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const debug = require('debug')('authlab:user');
const httpErrors = require('http-errors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  findHash: { type: String, unique: true}
});

userSchema.methods.generateHash = function(password){
  debug('generateHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.compareHash = function(password){
  debug('compareHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare( password, this.password, (err, result) => {
      // if bcrypt breaks, return status 500
      if (err) return reject(err);
      // if wrong password
      if (!result) return reject(httpErrors(401, 'wrong password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    var tries = 0;
    _generateFindHash.call(this);

    function _generateFindHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch((err) => {
        if (tries > 5) reject(err);
        tries++;
        _generateFindHash.call(this); // i don't get what's going on here x_x
      });
    }
  });
};

userSchema.methods.generateToken = function(){
  debug('generateToken');
  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then( findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch(reject);
  });
};

module.exports = mongoose.model('user', userSchema);
