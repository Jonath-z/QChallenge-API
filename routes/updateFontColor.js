const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const router = express.Router();

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongodb = mongoose.connection;
router.use(bodyparser.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  const color = req.body.fontColor;
  const id = req.body.userID;

  mongodb.collection("users").updateOne(
    { id: id },
    {
      $set: {
        fontColor: color,
      },
    }
  );
  res.send("updated");
});

module.exports = router;
