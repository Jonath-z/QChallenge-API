const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const mongoose = require("mongoose");
const login = require("./routes/login.js");
const signup = require("./routes/signup.js");
const challenges = require("./routes/challenge.js");
const theme = require("./routes/theme");
const updateScore = require("./routes/updateScore.js");
const googleLogin = require("./routes/googleLogin.js");
const getAllUser = require("./routes/getAllUsers.js");
const getAllMessages = require("./routes/getAllMessages.js");
const updateFontColor = require("./routes/updateFontColor.js");
const deleteMessages = require("./routes/deleteMessage.js");
const getUserData = require("./routes/getUserData.js");
const updateProfileImage = require("./routes/update/userProfileImage.js");
const updateProfileDetails = require("./routes/update/updateProfileDetails");
const correct = require("./routes/correct.js");

console.log(process.env.PORT);

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongodb = mongoose.connection;

app.use(cors());
app.use("/statics", express.static(path.join(__dirname, "./src/index.css")));
app.use("/static", express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use("/login", login);
app.use("/signup", signup);
app.use("/challenges", challenges);
app.use("/theme", theme);
app.use("/update", updateScore);
app.use("/login-With-Google", googleLogin);
app.use("/all-users", getAllUser);
app.use("/all-messages", getAllMessages);
app.use("/update-font-color", updateFontColor);
app.use("/delete-messages", deleteMessages);
app.use("/get-user-data", getUserData);
app.use("/upgate-profile/image", updateProfileImage);
app.use("/update-user-datails", updateProfileDetails);
app.use("/correct", correct);

io.on("connect", (socket) => {
  // console.log(socket.id);
  socket.on("user-socket-id", ({ userID, socketID }) => {
    // console.log(userID, socketID);
    mongodb.collection("users").updateOne(
      { id: `${userID}` },
      {
        $set: {
          socketID: socketID,
        },
      }
    );
  });
  socket.on("online", ({ userID }) => {
    socket.broadcast.emit("online-user", { userID, status: true });
  });
  socket.on(
    "send-message",
    ({ message, senderID, receiverID, senderPseudo, time }) => {
      const receiver = `${receiverID.current}`;
      // console.log('my message', message, 'from', senderID, 'to', receiverID.current)
      mongodb.collection("messages").insertOne({
        message: message,
        sender: senderID,
        receiver: receiverID.current,
        time: time,
      });
      mongodb
        .collection("users")
        .find({ id: `${receiverID.current}` })
        .toArray((err, data) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(data);
            socket
              .to(data[0].socketID)
              .emit("receive-message", {
                message,
                senderID,
                receiver,
                senderPseudo,
                time,
              });
          }
        });
    }
  );
  socket.on("join-duel", ({ getDuelID, senderID, receiver, senderPseudo }) => {
    // console.log(getDuelID, senderID, receiver, senderPseudo);
    const joinDuelID = getDuelID;
    mongodb
      .collection("users")
      .find({ id: `${receiver}` })
      .toArray((err, data) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          socket
            .to(data[0].socketID)
            .emit("request-join-duel", { joinDuelID, senderID, senderPseudo });
        }
      });
  });
  socket.on(
    "true-duelID",
    ({ duelLevel, duelCreator, senderID, duelTheme }) => {
      // console.log(duelLevel, duelCreator, senderID, duelTheme);
      mongodb
        .collection("users")
        .find({ id: `${senderID}` })
        .toArray((err, data) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(data);
            socket
              .to(data[0].socketID)
              .emit("joined-duel", {
                duelLevel,
                senderID,
                duelCreator,
                duelTheme,
              });
          }
        });
    }
  );
  socket.on("false-duelID", (senderID) => {
    mongodb
      .collection("users")
      .find({ id: `${senderID}` })
      .toArray((err, data) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          socket
            .to(data[0].socketID)
            .emit("join-duel-fail", "verify the duel ID");
        }
      });
  });
  socket.on("joiner", ({ joinerPseudo, duelCreator, duelLevel, duelTheme }) => {
    mongodb
      .collection("users")
      .find({ id: `${duelCreator}` })
      .toArray((err, data) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          socket
            .to(data[0].socketID)
            .emit("duel-joiner", { joinerPseudo, duelLevel, duelTheme });
        }
      });
  });
  socket.on("stop-duel", (duelJoinerID) => {
    // console.log(duelJoinerID);
    mongodb
      .collection("users")
      .find({ pseudo: `${duelJoinerID}` })
      .toArray((err, data) => {
        if (err) console.log(err);
        else {
          socket.to(data[0].socketID).emit("duel-stoped", "Duel stoped");
          // console.log(data);
        }
      });
  });
  socket.on("score-to-joiner", ({ duelJoiner, duelScore }) => {
    mongodb
      .collection("users")
      .find({ id: `${duelJoiner}` })
      .toArray((err, data) => {
        if (err) console.log(err);
        else {
          socket.to(data[0].socketID).emit("duel-score-joiner", duelScore);
          // console.log(duelJoiner , duelScore);
        }
      });
  });
  socket.on("score-to-creator", ({ duelCreator, duelScore }) => {
    mongodb
      .collection("users")
      .find({ id: `${duelCreator}` })
      .toArray((err, data) => {
        if (err) console.log(err);
        else {
          socket.to(data[0].socketID).emit("duel-score-creator", duelScore);
          // console.log(duelCreator, duelScore);
        }
      });
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./build"));
}

server.listen(process.env.PORT || 5050, () => {
  console.log("server is running");
});
