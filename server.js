"use strict";

const { DATABASE_URL, PORT } = require("./config");
const express = require("express");
const app = express();
mongoose.Promise = global.Promise;

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;
