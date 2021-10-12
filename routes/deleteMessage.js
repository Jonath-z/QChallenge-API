const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const router = express.Router();

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;
router.use(bodyparser.urlencoded({ extended: false }));


router.post('/',async (req, res) => {
    const message = req.body.message;
    const user = req.body.userID;
    // console.log('message deleted', message);
    
   await mongodb.collection('messages').deleteOne({
        message: message,
        receiver:user
    });
  await mongodb.collection('messages').deleteOne({
        message: message,
        sender:user
    });
});

module.exports = router;