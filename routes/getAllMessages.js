const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongodb = mongoose.connection;

router.get("/", async (req, res) => {
  const messages = await mongodb.collection("messages").find({}).toArray();
  res.send(messages);
});
module.exports = router;
