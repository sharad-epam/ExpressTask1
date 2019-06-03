const express = require("express");
const app = express();
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/clientErrorHandler");
const port = process.env.PORT || 5000;

app.use(logger);

//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/news", require("./routes/news"));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}!`));
