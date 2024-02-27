import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import Chat from "../models/chat.model.js";
import asynHandler from "express-async-handler";
import Chatmessage from "../models/chatMessage.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * @description : to structure chat model as our requirement
 * @returns : array of aggeragtion pipelines stages ;
 */
const ChatAggeragtion = () => {
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
        pipeline: [
          {
            $project: {
              usename: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "chatmessages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
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
                    email: 1,
                    avatar: 1,
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
        ],
      },
    },
    {
      $addFields: {
        lastMessage: {
          $first: "$lastMessage",
        },
      },
    },
  ];

  return pipeline;
};

/**
 * @params : string (chatId)
 * @description : when chat deleted delete all messages in that chat
 */
const deleteCascadeMessages = asynHandler(async (chatId) => {
  // fetch the messages associated with the chat to remove
  const messages = await Chatmessage.find({
    chat: new mongoose.Types.ObjectId(chatId),
  });

  //delete all messages
  await Chatmessage.deleteMany({
    chat: new mongoose.Types.ObjectId(chatId),
  });
});

/**
 * Handles the request to create a one-to-one chat or retrive existing chat
 * @params : reciverId
 * @returns : structued chat model
 * @routes : api/chat/:reciverId
 */
const createOneToOneOrGetChat = asynHandler(async (req, res) => {
  const { reciverId } = req.params;

  const reciver = await User.findById(new mongoose.Types.ObjectId(reciverId));

  if (!reciver) {
    throw new ApiError(404, "reciver does not exist !");
  }

  if (reciver._id.toString() == req.user._id.toString()) {
    throw new ApiError(400, "you can not chat with your self!");
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        isGroup: false,
        $and: [
          {
            members: { $elemMatch: { $eq: req.user._id } },
          },
          {
            members: {
              $elemMatch: { $eq: new mongoose.Types.ObjectId(reciverId) },
            },
          },
        ],
      },
    },
    ...ChatAggeragtion(),
  ]);

  if (chat.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, chat[0], "chat fetched Successfully!"));
  }

  const newChat = await Chat.create({
    name: "One to One Chat",
    members: [req.user._id, new mongoose.Types.ObjectId(reciverId)],
    isGroup: false,
    admin: req.user._id,
  });

  //structure the chat
  const createdChat = await Chat.aggregate([
    {
      $match: {
        _id: newChat._id,
      },
    },
    ...ChatAggeragtion(),
  ]);

  if (!createdChat[0]) {
    throw new ApiError(500, "Internal server Error!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdChat[0], "Chat retrieved successfully"));
});

export { createOneToOneOrGetChat };
