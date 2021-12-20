const express = require("express");
const mongoose = require("mongoose");
const HttpError = require("./error");
const Message = require("./message");

const router = express.Router();
const Schema = mongoose.Schema;

const { Encrypt, Decrypt } = require("./encryption");

const chatSchema = new Schema({
  userOne: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userTwo: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  messages: [
    {
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
    },
  ],
});

const Chat = new mongoose.model("Chat", chatSchema);

router.get("/chat/:senderId/:receiverId", async (req, res, next) => {
  let existingChatOne, existingChatTwo;
  const { senderId, receiverId } = req.params;

  try {
    existingChatOne = await Chat.findOne({
      $and: [{ userOne: senderId }, { userTwo: receiverId }],
    });
  } catch (err) {
    const error = new HttpError("Error finding chat", 500);
    return next(error);
  }

  if (!existingChatOne) {
    try {
      existingChatTwo = await Chat.findOne({
        $and: [{ userOne: receiverId }, { userTwo: senderId }],
      });
    } catch (err) {
      const error = new HttpError("Error finding chat", 500);
      return next(error);
    }
  }

  if (!existingChatOne && !existingChatTwo) {
    console.log("Creating new chat");
    const newChat = new Chat({
      userOne: senderId,
      userTwo: receiverId,
      messages: [],
    });

    try {
      await newChat.save();
    } catch (err) {
      const error = new HttpError("Error creating chat", 500);
      return next(error);
    }

    res.status(200).json({ chat: newChat });
  }

  if (existingChatOne) {
    console.log("Chat exists for " + senderId + " " + receiverId);
    let encryptedMessages = existingChatOne.messages;
    // let messages = encryptedMessages.map((message) => {
    //   const decryptedMessage = Decrypt(message.message);
    //   return {
    //     sender: message.sender,
    //     receiver: message.receiver,
    //     message: decryptedMessage,
    //     _id: message._id,
    //   };
    // });
    existingChatOne.messages = encryptedMessages;
    res.status(200).json({ chat: existingChatOne });
  }

  if (existingChatTwo) {
    console.log("Chat exists two");
    let encryptedMessages = existingChatTwo.messages;
    // let messages = encryptedMessages.map((message) => {
    //   const decryptedMessage = Decrypt(message.message);
    //   return {
    //     sender: message.sender,
    //     receiver: message.receiver,
    //     message: decryptedMessage,
    //     _id: message._id,
    //   };
    // });
    existingChatTwo.messages = encryptedMessages;
    res.status(200).json({ chat: existingChatTwo });
  }
});

router.post("/chat/addMessage/:chatId", async (req, res, next) => {
  const { chatId } = req.params;
  const { sender, receiver, message } = req.body;

  let chat;

  try {
    chat = await Chat.findById(chatId);
  } catch (err) {
    const error = new HttpError("Error finding chat", 500);
    return next(error);
  }

  if (!chat) {
    const error = new HttpError("Chat not found", 404);
    return next(error);
  }

  console.log("Chat found");
  console.log(chat);

  chat.messages.push({ sender, receiver, message: message });

  try {
    await chat.save();
  } catch (error) {
    const err = new HttpError("Error saving chat", 300);
    return next(err);
  }

  console.log("Chat saved");

  res.status(200).json({ message: "Message added successfully" });
});

module.exports = router;
