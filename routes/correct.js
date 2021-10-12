const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;

router.get('/', (req, res) => {
    // mongodb.collection('challenges').updateMany(
    //     {
    //         theme: 'Contry and Capital'
    //     },
    //     {
    //     $set: {
    //             theme: 'Country and Capital',
    //     }
    //     });
    // console.log(MONGODB_URL);
    res.send('....');
});

module.exports = router;