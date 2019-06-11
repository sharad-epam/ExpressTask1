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

module.exports = mongoose.model("User", UserSchema);

const createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

const getUserByUsername = (username, callback) => {
  let query = { username: username };
  User.findOne(query, callback);
};

const getUserById = (id, callback) => {
  User.findById(id, callback);
};

const comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  comparePassword
};
