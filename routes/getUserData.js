const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');



const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;

router.post('/',async(req, res) => {
    const userID = req.body.userID
    // console.log('my user', userID);
    const user = await mongodb.collection('users').find({ id: `${userID}` }).toArray();
    res.send(user);
    // console.log(user);
});
module.exports = router;