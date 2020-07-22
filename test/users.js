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
  id: ""
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
          token: user.authToken + "a",
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
          user.id = result.body.user.id;
          done();
        });
    });
    it("should throw an error because the session with the token does not exist", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-token")
        .query({
          token: user.authToken + "a",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    });
  });

  describe("Get User By ID", () => {
    it("should throw an error because the user doesn't exist", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-id")
        .query({
          id: user.id + "a",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should return a user data", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-id")
        .query({
          id: user.id,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.user.email.should.be.eq(user.email);
          done();
        });
    })
  })

  describe("User Info Update", () => {
    it("should throw an error while trying to change the user's bio", (done) => {
      chai
        .request(server)
        .post("/api/auth/change-bio")
        .send({
          token: user.authToken + "a",
          bio: "Hello World!",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should change the user's bio", (done) => {
      chai
        .request(server)
        .post("/api/auth/change-bio")
        .send({
          token: user.authToken,
          bio: "Hello World!",
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        });
    })
    it("should confirm that the bio has been changed", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-id")
        .query({
          id: user.id,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.user.bio.should.be("Hello World!");
          done();
        });
    })
    it("should fail changing the user's privacy settings because the user doesn't exist", (done) => {
      chai
        .request(server)
        .post("/api/auth/change-privacy-settings")
        .send({
          token: user.authToken + "a",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should change the user's privacy settings", (done) => {
      chai
        .request("/api/auth/change-privacy-settings")
        .send({
          token: user.authToken,
          seeEmail: 2,
          textMe: 2,
          seeRealName: 2,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
        })
    })
    it("should confirm that the settings were changed", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-id")
        .query({
          id: user.id,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.user.seeEmail.should.be(2);
          result.body.user.textMe.should.be(2);
          result.body.user.seeRealName.should.be(2);
          done();
        });
    })
    // Add tests to update the profile picture
  })

  describe("Logout", () => {
    it("should throw an error because the user doesn't exist", (done) => {
      chai
        .request(server)
        .get("/api/auth/logout")
        .query({
          token: user.authToken + "a",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should logout the user", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-id")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        });
    })
    it("should confirm that user is logged out", (done) => {
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
    })
  })
});
