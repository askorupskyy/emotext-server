const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

const user = {
  email: "testuser@mail.com",
  password: "HelloWorld123",
  name: "Test User",
  username: "testuser",
  authToken: "",
};

describe("Authentication", function () {
  before(function (done) {
    this.timeout(10000); // A very long environment setup.
    setTimeout(done, 9500);
  });
  describe("Sign Up", () => {
    it("should fail creating an account with a password that doesn't meet the requirements", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: user.email,
          password: "123456",
          name: user.name,
          username: user.username,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it("should create an account", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: user.email,
          password: user.password,
          name: user.name,
          username: user.name,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        });
    });
    it("should fail creating an account with a registered email", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: user.email,
          password: user.password,
          name: user.name,
          username: user.name,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
  });
  describe("Login", () => {
    it("should fail to log in the user with an incorrect password", (done) => {
      chai
        .request(server)
        .post("/api/auth/signin")
        .send({
          email: user.email,
          password: user.password + "1",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it("should fail to log in the user that was not registered yet", (done) => {
      chai
        .request(server)
        .post("/api/auth/signin")
        .send({
          email: user.email + "111",
          password: user.password,
        })
        .end((err, result) => {
          result.should.have.status(404);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it("should log in the user and return a token", (done) => {
      chai
        .request(server)
        .post("/api/auth/signin")
        .send({
          email: user.email,
          password: user.password,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.should.have.property("token");
          user.authToken = result.body.token;
          done();
        });
    });
  });
  describe("Logout", () => {
    it("should fail because the token is invalid", (done) => {
      chai
        .request(server)
        .get("/api/auth/logout")
        .query({
          token: user.authToken.substring(0, user.authToken.length - 1) + "a",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
    it("should set the auth token as deleted", (done) => {
      chai
        .request(server)
        .get("/api/auth/logout")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        });
    });
  });
});
