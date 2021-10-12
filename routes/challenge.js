const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');



const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;

router.get('/',async (req, res) => {
    const allQuestions = await mongodb.collection('challenges').find({}).toArray();
    allQuestions.map(challenge => {
        delete challenge.rationale;
        if (challenge.city) {
            challenge['question'] = challenge['country'];
        }
    });
    res.send(allQuestions);
});

module.exports = router;