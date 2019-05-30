const express = require("express");
const router = express.Router();
const newsData = require("./news.json");

//Get all News
router.get("/", (req, res) => {
  res.send(newsData);
});

//Get Single News
router.get("/:id", (req, res, next) => {
  const exits = newsData.sources.some(item => item.id === req.params.id);
  if (exits) {
    res.send(newsData.sources.filter(item => item.id === req.params.id));
  } else {
    const error = new Error(
      `News channel does not exits! with ${req.params.id}`
    );
    error.status = 404;
    next(error);
  }
});

//Add new news channel
router.post("/", (req, res, next) => {
  const newsChannel = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    category: req.body.category,
    language: req.body.language,
    country: req.body.country,
    urlsToLogos: {
      small: "",
      medium: "",
      large: ""
    },
    sortBysAvailable: req.body.sortBysAvailable
  };
  if (!newsChannel.id || !newsChannel.name) {
    const error = new Error(`Please include the id and name of the channel`);
    error.status = 400;
    next(error);
  }
  newsData.sources.push(newsChannel);
  res.send(newsData);
});

//update the news data
router.put("/:id", (req, res,next) => {
  const exits = newsData.sources.some(item => item.id === req.params.id);
  if (exits) {
    const updatedChannel = req.body;
    newsData.sources.forEach(channel => {
      if (channel.id === req.params.id) {
        channel.id = updatedChannel.id ? updatedChannel.id : channel.id;
        channel.name = updatedChannel.name ? updatedChannel.name : channel.name;
        channel.description = updatedChannel.description
          ? updatedChannel.description
          : channel.description;
        channel.url = updatedChannel.url ? updatedChannel.url : channel.url;
        channel.category = updatedChannel.category
          ? updatedChannel.category
          : channel.category;
        channel.language = updatedChannel.language
          ? updatedChannel.language
          : channel.language;
        channel.country = updatedChannel.country
          ? updatedChannel.country
          : channel.country;
        channel.urlsToLogos = updatedChannel.urlsToLogos
          ? updatedChannel.urlsToLogos
          : channel.urlsToLogos;
        channel.sortBysAvailable = updatedChannel.sortBysAvailable
          ? updatedChannel.sortBysAvailable
          : channel.sortBysAvailable;

        res.json({ msg: "Channel updated", channel });
      }
    });
  } else {
    const error = new Error(`No channel found with ${req.params.id}`);
    error.status = 400;
    next(error);
  }
});

//delete news channel
router.delete("/:id", (req, res, next) => {
  const exits = newsData.sources.some(item => item.id === req.params.id);
  if (exits) {
    res.json({
      msg: "Channel deleted",
      newsData: newsData.sources.filter(item => item.id !== req.params.id)
    });
  } else {
    const error = new Error(
      `News channel does not exits! with ${req.params.id}`
    );
    error.status = 404;
    next(error);
  }
});

module.exports = router;
