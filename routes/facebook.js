const express = require("express");
const router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: "1242331869278967",
      clientSecret: "6ebf4fa2b4eb6a0abdd0fbbd4c6877f6",
      callbackURL: "http://localhost:5000/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({ "facebook.id": profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        else {
          // if there is no user found with that facebook id, create them
          const newUser = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.name = profile.displayName;
          if (typeof profile.emails != "undefined" && profile.emails.length > 0)
            newUser.facebook.email = profile.emails[0].value;

          // save our user to the database
          newUser.save(err => {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  )
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect("/");
  }
);

module.exports = router;
