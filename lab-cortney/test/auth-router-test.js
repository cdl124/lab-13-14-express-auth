'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'supersecretcode';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// require npm test tools
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authlab:auth-router-test');

// require app modules
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

// module constants
const server = require('../server');
const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;

request.use(superPromise);

describe('testing module auth-router', function(){

  before((done) => { //start up the server for testing
    debug('before module auth-router');
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        debug('server up on port:', port);
        done();
      });
      return;
    }
    done();
  });
  after((done) => { // then shut 'er down
    debug('after module auth-router');
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        debug('server down');
        done();
      });
    }
  });

  describe('testing POST /api/signup', function(){

    after((done) => { // remove user created for POST test
      debug('after POST /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return status 200 and a token', function(done){
      debug('test POST /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        username: 'cort',
        password: 'asdf1234'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });

    it('should return status 400 for no body', function(done){
      debug('test POST status 400 no body /api/signup');
      request.post(`${baseURL}/signup`)
      .send({})
      .then(res => {
        expect(res.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('should return status 400 for invalid body', function(done){
      debug('test POST status 400 invalid body /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        fudge: 'muffins',
        password: 'delicious'
      })
      .then(res => {
        expect(res.status).to.equal(400);
        done();
      })
      .catch(done);
    });
  }); // end POST test module


  describe('testing GET /api/signin', function(){

    before((done) => { // create a user to test on
      debug('before GET /api/aignup');
      authController.signup({username: 'cort', password: '123456'})
      .then(() => done())
      .catch(done);
    });
    after((done) => { // remove user after testing
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done){
      debug('test GET /api/signin');
      request.get(`${baseURL}/signin`)
      .auth('cort', '123456')
      .then( res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });

    it('should return status 401 wrong credentials', function(done){
      debug('test GET status 401');
      request.get(`${baseURL}/signin`)
      .auth('cort', 'wrongpassword')
      .then(res => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  }); // end GET test module

}); // end testing auth-router module
