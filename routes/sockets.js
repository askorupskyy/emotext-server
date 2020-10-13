module.exports = function (io) {
  io.sockets.on("connection", socket => {

    socket.emit("user-online");

    socket.on("disconnected", userID => {
      socket.emit("user-offline", userID);
    })

    //basic socket.io test
    socket.emit("message", "Hello World!");

    //track users in friends list or in chats
    socket.on("watch-user", user => {
      socket.join(user.id);
      socket.on("send-friend-request", () => {
        io.to(room).emit("friend-request-sent");
      })
      socket.on("name-changed", name => {
        io.to(room).emit("name-changed", name);
      })
      socket.on("picture-changed", pictureURL => {
        io.to(room).emit("picture-changed", pictureURL);
      })
      socket.on("picture-changed", pictureURL => {
        io.to(room).emit("picture-changed", pictureURL);
      })
    })

    //track friend requests
    socket.on("watch-friend-request", friendRequest => {
      socket.join(friendRequest);
      socket.on("accept-request", () => {
        io.to(room).emit("request-accepted");
      })
      socket.on("decline-request", () => {
        io.to(room).emit("request-declined");
      })
      socket.on("ignore-request", () => {
        io.to(room).emit("request-ignored");
      })
    })

    //track chat activities
    socket.on("open-chat", (isGroup, chatID) => {
      socket.join(`${isGroup ? "g" : ""}${chatID}`);
      socket.on("message-read", message => {
        io.to(room).emit("message-read", message);
      })
      socket.on("message-sent", message => {
        io.to(room).emit("message-sent", message);
      })
      socket.on("message-deleted", message => {
        io.to(room).emit("message-deleted", message);
      })
      socket.on("message-edited", message => {
        io.to(room).emit("message-edited", message);
      })
      socket.on("message-deleted", message => {
        io.to(room).emit("message-deleted", message);
      })
      socket.on("chat-name-changed", chatName => {
        io.to(room).emit("chat-name-changed", chatName);
      })
      socket.on("chat-picture-changed", chatPictureURL => {
        io.to(room).emit("chat-picture-changed", chatPictureURL);
      })
      socket.on("chat-person-kicked", user => {
        io.to(room).emit("chat-kicked", user);
      })
      socket.on("chat-admin-added", user => {
        io.to(room).emit("chat-admin-added", user);
      })
      socket.on("chat-person-added", user => {
        io.to(room).emit("chat-person-added", user);
      })
      socket.on("chat-kicked", user => {
        io.to(room).emit("chat-kicked", user);
      })
    })
  })
}
