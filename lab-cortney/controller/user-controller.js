'use strict';

const User = require('../model/user');
const debug = require('debug')('authlab:user-controller');

exports.removeAllUsers = function(){
  debug('removeAllUsers');
  return User.remove({});
};
