const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
let UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

let User = (module.exports = mongoose.model("User", UserSchema));

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = (username, callback) => {
  let query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
