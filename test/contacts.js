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
  id: "",
};

const userTwo = {
  email: "testuser2@mail.com",
  password: "HelloWorld123",
  name: "Test User2",
  username: "testuser2",
  authToken: "",
  id: ""
};

const userThree = {
  email: "testuser@mail.com",
  password: "HelloWorld123",
  name: "Test User3",
  username: "testuser3",
  authToken: "",
  id: ""
};

let friendRequestID = "";


describe("Contacts", () => {
  describe("Log In", () => {
    it("should log in the first user and return a token", (done) => {
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
    it("should log in the second user and return a token", (done) => {
      chai
        .request(server)
        .post("/api/auth/signin")
        .send({
          email: userTwo.email,
          password: userTwo.password,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.should.have.property("token");
          userTwo.authToken = result.body.token;
          done();
        });
    });
    it("should log in the third user and return a token", (done) => {
      chai
        .request(server)
        .post("/api/auth/signin")
        .send({
          email: userThree.email,
          password: userThree.password,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.should.have.property("token");
          userThree.authToken = result.body.token;
          done();
        });
    });
  })
  describe("Fetch Users", () => {
    it("should get the first user by token", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-token")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          user.id = result.body.user.id;
          done();
        });
    });
    it("should get the second user by token", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-token")
        .query({
          token: userTwo.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          userTwo.id = result.body.user.id;
          done();
        });
    });
    it("should get the third user by token", (done) => {
      chai
        .request(server)
        .get("/api/auth/get-user-by-token")
        .query({
          token: userThree.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          userThree.id = result.body.user.id;
          done();
        });
    });
  })
  describe("Friend Requests", () => {
    it("should send the friend request to user two", (done) => {
      chai
        .request(server)
        .post("/api/contacts/send-friend-request/")
        .send({
          token: user.authToken,
          friend: userTwo.id,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        })
    })
    it("should output all of the friend requests user two has", (done) => {
      chai
        .request(server)
        .get("/api/contacts/get-friend-requests/")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.should.have.property("requests");
          friendRequestID = result.body.requests[0].id;
          done();
        })
    })
    it("should decline the friend request by user one", (done) => {
      chai
        .request(server)
        .post("/api/contacts/decline-friend-request")
        .send({
          token: userTwo.authToken,
          requestID: friendRequestID,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        })
    })
    it("should confirm that the friend request was declined", (done) => {
      chai
        .request(server)
        .get("/api/contacts/get-friend-requests/")
        .query({
          token: user.authToken
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.should.have.property("requests");
          result.body.requests[0].didReject.should.be.eq(true);
          done();
        })
    })
    it("should send another request to user two", (done) => {
      chai
        .request(server)
        .post("/api/contacts/send-friend-request/")
        .send({
          token: user.authToken,
          friend: userTwo.id,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        })
    })
    it("should get all requests again", (done) => {
      chai
        .request(server)
        .get("/api/contacts/get-friend-requests/")
        .query({
          token: user.authToken,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.should.have.property("requests");
          friendRequestID = result.body.requests[0].id;
          done();
        })
    })
    it("should accept the user friend request", (done) => {
      chai
        .request(server)
        .post("/api/contacts/accept-friend-request")
        .send({
          token: userTwo.authToken,
          requestID: friendRequestID
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        })
    })
    it("should throw an error because you are already friends with user two", (done) => {
      chai
        .request(server)
        .post("/api/contacts/send-friend-request/")
        .send({
          token: user.authToken,
          friend: userTwo.id,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        })
    })
    it("should rename the user one friend", (done) => {
      chai
        .request(server)
        .post("/api/contacts/rename-friend/")
        .send({
          token: user.authToken,
          friendID: userTwo.id,
          name: "User Two!",
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          done();
        })
    })
    it("should confirm the friend has been renamed and that he exists", (done) => {
      chai
        .request(server)
        .get("/api/contacts/get-contacts/")
        .query({
          token: user.authToken
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          result.body.contacts[0].userTwoName.should.be.eq("User Two!")
          done();
        })
    })
  })
})