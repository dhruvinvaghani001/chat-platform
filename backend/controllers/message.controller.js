import Chat from "../models/chat.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import Chatmessage from "../models/chatMessage.model.js";
import asyncHandler from "express-async-handler";

/**
 *  Aggregate Chat Messages
 *  @returns pipline array of stages of aggeragation
 */
const ChatMessageAggregation = () => {
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: {
          $first: "$sender",
        },
      },
    },
  ];

  return pipeline;
};

/**
 * Hanldes to get all messages in particular chat
 * @params :  chatId (to get all messages of particular chat)
 * @returns : array of messages with aggearagtion pipeline result
 * @desciption : function to get all messages with particular ChatId,
 */

const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(new mongoose.Types.ObjectId(chatId));

  if (!chat) {
    return res.status(404).json( new ApiError(404, "Chat not Found !"));
  }

  const messages = await Chatmessage.aggregate([
    {
      $match: { chat: new mongoose.Types.ObjectId(chatId) },
    },
    ...ChatMessageAggregation(),
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, messages || [], "messages fetched successfully !")
    );
});

/**
 * Handles the request to send a message in chat
 * @params : chatId (to send message)
 * @req[body] : content (message)
 * @returns : new structured Message!
 * @description : function to send message in Chat
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json(new ApiError(400, "content required to send message!"));
  }

  const chat = await Chat.findById(new mongoose.Types.ObjectId(chatId));

  if (!chat) {
    return res.staus(404).json(new ApiError(404, "Chat not found !"));
  }

  // create new message
  const message = await Chatmessage.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content,
    chat: new mongoose.Types.ObjectId(chatId),
  });

  if (!message) {
    return res.status(500).json(new ApiError(500, "message not created !"));
  }

  // update the last message to chat
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    { new: true }
  );

  // structure the message
  const newMessage = await Chatmessage.aggregate([
    {
      $match: { _id: message._id },
    },
    ...ChatMessageAggregation(),
  ]);

  const recivedMessage = newMessage[0];

  return res
    .status(200)
    .json(new ApiResponse(200, recivedMessage, "send message successfully!"));
});

export { getAllMessages, sendMessage };
