const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

require('../../index');

const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;

router.post('/', (req, res) => {
    const userID = req.body.userID;
    const newProfile = req.body.url;
    // console.log('my user', userID, 'URL', newProfile);
    mongodb.collection('users').updateOne(
        {
            id: userID
        },
        {
        $set: {
            avatar: newProfile
        }
    });
});
module.exports = router;