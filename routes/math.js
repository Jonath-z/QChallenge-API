// const express = require('express');
// const bodyparser = require('body-parser');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const { body, validationResult } = require('express-validator');

// const router = express.Router();
// router.use(bodyparser.urlencoded({ extended: false }));

// mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
// const mongodb = mongoose.connection;

// router.get('/', (req, res) => {
//     mongodb.collection('math').find({}).toArray((err, data) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             data.map(question => {
//                 mongodb.collection('challenges').insertOne(question);
//             })
//         }
//     })
//     res.send('math questions uploaded in challenges collection...');
// });
// module.exports = router;
