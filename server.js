const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

const authApi = require("./routes/api/auth");
const chatApi = require("./routes/api/chats");

const db = require("./util/db");

app.use(express.urlencoded());
app.use(express.json());

app.use(cors());

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 8 * 1024 * 1024 * 1024, //8MB max file(s) size
    },
  })
);

app.use("/api/auth/", authApi);
app.use("/api/chat/", chatApi);

db.sync({ force: true })
  .then(() => {
    app.listen("5000", () => {
      console.log("Listening on port 5000");
    });
  })
  .catch((e) => {
    throw new Error(e);
  });

module.exports = app;
