const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  news_id: String,
  name: String,
  description: String,
  url: String,
  category: String,
  language: String,
  country: String,
  urlsToLogos: {
    small: String,
    medium: String,
    large: String
  },
  sortBysAvailable: Array
});

module.exports = mongoose.model("News", newsSchema);
