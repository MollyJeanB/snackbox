"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const snackSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tastiness: {
    rating: { type: Number, required: true },
    shareable: { type: Boolean, required: true }
  },
  supply: { type: Number, required: true }
});

snackSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    tastiness: this.tastiness,
    supply: this.supply
  };
};

const Snack = mongoose.model("Snack", snackSchema);

module.exports = { Snack };
