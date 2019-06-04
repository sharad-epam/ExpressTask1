const express = require("express");
const router = express.Router();
const User = require("./models/user");

router.post("/", (req, res, next) => {
  const password = req.body.password;
  const password2 = req.body.password2;

  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length !== 0) {
        const error = new Error(`User already exits!`);
        error.status = 409;
        next(error);
      } else {
        if (password === password2) {
          let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
          });

          newUser
            .save()
            .then(result => {
              res.json({ result });
            })
            .catch(err => {
              const error = new Error(
                `Some Error occured while posting the data`
              );
              error.status = 400;
              next(error);
            });
        } else {
          res
            .status(500)
            .send('{errors: "Passwords don\'t match"}')
            .end();
        }
      }
    });
});

module.exports = router;
