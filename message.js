const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;
