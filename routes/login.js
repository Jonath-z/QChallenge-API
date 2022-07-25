const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(`${process.env.REACT_APP_MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongodb = mongoose.connection;

router.post(
  "/",
  body("email").isEmail().normalizeEmail().notEmpty(),
  body("password").notEmpty().isLength({ min: 4 }),
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.send({ status: "404 email" });
      // console.log('login err')
    } else {
      const password = req.body.password.trim();
      const email = req.body.email.trim();
      const findUser = async () => {
        const data = await mongodb
          .collection("users")
          .find({ email: `${email}` })
          .toArray();
        const encryptPassword = async () => {
          const validPassword = await bcrypt.compare(
            password,
            data[0].password
          );
          if (validPassword) {
            // console.log(data[0]);
            res.send({
              status: "200",
              data: {
                id: data[0].id,
                avatar: data[0].avatar,
                score: data[0].score,
                pseudo: data[0].pseudo,
                socketID: data[0].socketID,
              },
            });
          } else {
            res.send({ status: "404" });
          }
          // console.log(data);
        };
        encryptPassword();
        // }
        // })
      };
      findUser();
      // console.log(email);
    }
  }
);

module.exports = router;
