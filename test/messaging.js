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

