const express = require("express");
const router = express.Router();
const newsData = require("./news.json");
const mongoose = require("mongoose");


const News = require("./models/news");
//Get all News
router.get("/", (req, res) => {
  News.find()
    .exec()
    .then(results => {
      if (results) {
        res.json({ results });
      } else {
        const error = new Error(`No records to display`, err);
        error.status = 400;
        next(error);
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Get Single News
router.get("/:id", (req, res, next) => {
  News.findById(req.params.id)
    .exec()
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        const error = new Error(
          `News channel does not exits! with ${req.params.id}`
        );
        error.status = 400;
        next(error);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

//Add new news channel
router.post("/", (req, res, next) => {
  const news = new News({
    _id: new mongoose.Types.ObjectId(),
    news_id: req.body.id,
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
  });
  news
    .save()
    .then(result => {
      res.json({ result });
    })
    .catch(err => {
      const error = new Error(`Some Error occured while posting the data`, err);
      error.status = 400;
      next(error);
    });
});

//update the news data
router.put("/:id", (req, res, next) => {
  News.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, result) => {
    if (err) {
      const error = new Error(`No channel found with ${req.params.id}`);
      error.status = 400;
      next(error);
    }
    res.json({
      msg: `Record with id ${req.params.id} updated successfully!!`,
      result
    });
  });
});

//delete news channel
router.delete("/:id", (req, res, next) => {
  const exits = req.params.id;

  News.deleteOne({ _id: exits })
    .exec()
    .then(result => {
      if (result.length >= 0) {
        res.json({ result });
      } else {
        const error = new Error(
          `News channel does not exits! with ${req.params.id}`
        );
        error.status = 404;
        next(error);
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
