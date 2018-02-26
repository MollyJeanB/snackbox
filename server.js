"use strict";

const { DATABASE_URL, PORT } = require("./config");
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
// const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const { Snack } = require("./models");
mongoose.Promise = global.Promise;
app.use(express.json());

app.get("/snacks", (req, res) => {
  Snack.find()
    .then(snacks => {
      res.json(snacks.map(snack => snack.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "bad bad bad" });
    });
});

app.get("/snacks/:id", (req, res) => {
  Snack.findById(req.params.id)
    .then(snack => {
      res.json(snack.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

app.post("/snacks", (req, res) => {
  let requiredFields = ["title", "description", "tastiness", "supply"];
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!field) {
      return res.status(400).json({ error: "missing field in request body" });
    }
  }
  console.log(req.body);
  Snack.create({
    title: req.body.title,
    description: req.body.description,
    tastiness: req.body.tastiness,
    supply: req.body.supply
  })
    .then(newSnack => {
      res.status(201).json(newSnack.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

app.put("/snacks/:id", (req, res) => {
  if (!(req.params.id === req.body.id)) {
    return res.status(400).json({ error: "nah dog, ids don't match" });
  }
  let requiredFields = ["title", "description", "tastiness", "supply"];
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!field) {
      return res.status(400).json({ error: "missing field in request body" });
    }
  }

  const updatedSnack = {
    title: req.body.title,
    description: req.body.description,
    tastiness: req.body.tastiness,
    supply: req.body.supply
  };

  Snack.findByIdAndUpdate(req.body.id, updatedSnack, { new: true })
    .then(updatedSnack => {
      res.status(201).json(updatedSnack);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

app.delete("/snacks/:id", (req, res) => {
  Snack.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

let server;

// connect to database, then start the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
