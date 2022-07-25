const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

require("../../index");

const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongodb = mongoose.connection;

router.post("/", (req, res) => {
  const userID = req.body.userID;
  const newEmail = req.body.newEmail;
  const newPseudo = req.body.newPseudo;
  // console.log('for update', userID, newEmail, newPseudo);
  if (newEmail !== "") {
    mongodb.collection("users").updateOne(
      {
        id: userID,
      },
      {
        $set: {
          email: newEmail,
        },
      }
    );
  }
  if (newPseudo !== "") {
    mongodb.collection("users").updateOne(
      {
        id: userID,
      },
      {
        $set: {
          pseudo: newPseudo,
        },
      }
    );
  }
});
module.exports = router;
