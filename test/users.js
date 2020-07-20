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

describe("Users", () => {
  describe("Log In", () => {
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
  describe("Verify Token", () => {
    it("should check if the session exists and if it is not deleted", (done) => {
      chai
        .request(server)
        .get("/api/auth/verify")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        });
    });
    it("should return 401 because the session with given token does not exist", (done) => {
      chai
        .request(server)
        .get("/api/auth/verify")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
  });

  describe("Get User By Token", () => {
    it("should return the user info using the token", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-token")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.user.email.should.be.eq(user.email);
          done();
        });
    });
    it("should throw an error because the session with the token does not exist", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-token")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
  });
});
