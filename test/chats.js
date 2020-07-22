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

const userTwo = {
  email: "testuser2@mail.com",
  password: "HelloWorld123",
  name: "Test User2",
  username: "testuser2",
  authToken: "",
  id: ""
}

const userThree = {
  email: "testuser3@mail.com",
  password: "HelloWorld123",
  name: "Test User3",
  username: "testuser3",
  authToken: "",
  id: ""
}

let chatID = "";

describe("Chats", () => {
  describe("New users", () => {
    describe("Sign Up", () => {
      it("should create an account for the second user", (done) => {
        chai
          .request(server)
          .post("/api/auth/signup")
          .send({
            email: userTwo.email,
            password: userTwo.password,
            name: userTwo.name,
            username: userTwo.name,
          })
          .end((err, result) => {
            result.should.have.status(200);
            result.body.success.should.be.eq(true);
            done();
          });
      });
      it("should create an account for the third user", (done) => {
        chai
          .request(server)
          .post("/api/auth/signup")
          .send({
            email: userThree.email,
            password: userThree.password,
            name: userThree.name,
            username: userThree.name,
          })
          .end((err, result) => {
            result.should.have.status(200);
            result.body.success.should.be.eq(true);
            done();
          });
      });
    })
    describe("Login", () => {
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
    });
    describe("Locate Users", () => {
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
    });
  })
  describe("Create Chat", () => {
    it("should create a chat", (done) => {
      chai
        .request(server)
        .post("/api/chat/create-chat")
        .send({
          token: user.authToken,
          userTo: userTwo.id,
        })
        .end((err, result) => {
          result.should.have.status(200);
          result.body.success.should.be.eq(true);
          chatID = result.body.chat.id;
          done();
        });
    })
    it("should fail creating a chat because the user's token is invalid", (done) => {
      chai
        .request(server)
        .post("/api/chat/create-chat")
        .send({
          token: user.authToken + "a",
          userTo: userThree.id,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should fail creating a chat because it already exists", (done) => {
      chai
        .request(server)
        .post("/api/chat/create-chat")
        .send({
          token: user.authToken,
          userTo: userTwo.id,
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should fail creating a chat because one of the users does not exist", (done) => {
      chai
        .request(server)
        .post("/api/chat/create-chat")
        .send({
          token: user.authToken,
          userTo: userTwo.id + "g",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
  })
  describe("Load Chat", () => {
    it("should fail loading a chat because the user is not in it", (done) => {
      chai
        .request(server)
        .get("/api/chat/load-chat")
        .query({
          token: userThree.authToken,
          chatId: chatID
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should fail loading a chat because the user's token is invalid", (done) => {
      chai
        .request(server)
        .get("/api/chat/load-chat")
        .query({
          token: userThree.authToken + "a",
          chatId: chatID
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
    it("should fail loading a chat because the chat was not found", (done) => {
      chai
        .request(server)
        .get("/api/chat/load-chat")
        .query({
          token: userThree.authToken,
          chatId: chatID + "g",
        })
        .end((err, result) => {
          result.should.have.status(401);
          result.body.success.should.be.eq(false);
          done();
        });
    })
  })

})