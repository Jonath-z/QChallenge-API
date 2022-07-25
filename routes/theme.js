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
  const themes = await mongodb.collection("theme").find({}).toArray();
  res.send(themes);
  console.log(themes);
});

module.exports = router;
