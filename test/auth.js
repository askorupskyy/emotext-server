const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
  describe('Sign Up', () => {
    it('should fail creating an account with a password that doesn\'t meet the requirements', (done) => {
      chai.request(server)
        .post('/api/auth/signup')
        .send({
          'email': 'testuser@mail.com',
          'password': 'helloworld',
          'name': 'Test User',
          'username': 'testuser'
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it('should create an account', (done) => {
      chai.request(server)
        .post('/api/auth/signup')
        .send({
          'email': 'testuser@mail.com',
          'password': 'HelloWorld123',
          'name': 'Test User',
          'username': 'testuser'
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        });
    });
    it('should fail creating an account with a registered email', (done) => {
      chai.request(server)
        .post('/api/auth/signup')
        .send({
          'email': 'testuser@mail.com',
          'password': 'HelloWorld123',
          'name': 'Test User',
          'username': 'testuser'
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
  });
  describe('Login', () => {
    it('should fail to log in the user with an incorrect password', (done) => {
      chai.request(server)
        .post('/api/auth/signin')
        .send({
          'email': 'testuser@mail.com',
          'password': 'HelloWorld122'
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it('should fail to log in the user that was not registered yet', (done) => {
      chai.request(server)
        .post('/api/auth/signin')
        .send({
          'email': 'testuser1@mail.com',
          'password': 'HelloWorld123'
        })
        .end((err, result) => {
          result.should.have.status(404);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it('should log in the user and return a token', (done) => {
      chai.request(server)
        .post('/api/auth/signin')
        .send({
          'email': 'testuser@mail.com',
          'password': 'HelloWorld123'
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.should.have.property('token');
          done();
        });
    });
  });
});