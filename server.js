const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const User = require("./routes/models/user");
const LocalStrategy = require("passport-local").Strategy;
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/clientErrorHandler");
const port = process.env.PORT || 5000;

app.use(logger);

mongoose.connect("mongodb://localhost:27017/myapp", { useNewUrlParser: true });

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use("/news", require("./routes/news"));
app.use("/newUser", require("./routes/user"));
app.use("/facebook", require("./routes/facebook"));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Using LocalStrategy with passport

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        const error = new Error(`User does not exits!`);
        error.status = 404;
        next(error);
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          const error = new Error("Invalid Password");
          error.status = 500;
          next(error);
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}!`));
