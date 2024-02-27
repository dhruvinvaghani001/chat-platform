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
              username: 1,
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
 * Handles request to get all users on platfom
 *@returns : all available users in this platform
 */

const seachAvailableUsers = asynHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        $ne: req.user._id,
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        avatar: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "users fetched successfully!"));
});

/**
 * Handles the request to create a one-to-one chat or retrive existing chat
 * @params : reciverId
 * @returns : structued chat model
 * @routes : api/chat/c/:reciverId
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

/**
 * Handles request to create group
 * @req[body] : groupname , members array
 * @returns : created group chat
 * @description : to craete group chat
 */
const createGroup = asynHandler(async (req, res) => {
  let { name, members } = req.body;

  if (!name) {
    throw new ApiError(400, "name field required!");
  }
  if (!members) {
    throw new ApiError(400, "members array is required!");
  }
  if (members.includes(req.user._id.toString())) {
    throw new ApiError(
      400,
      "group creato is alredy member of group so don't pass it !"
    );
  }

  members = [...new Set([...members, req.user._id.toString()])];
  members = members.map((id) => new mongoose.Types.ObjectId(id));

  if (members.length < 3) {
    throw new ApiError(400, "To create group minimum 3 memebers required!");
  }

  const groupChat = await Chat.create({
    name,
    members: members,
    isGroup: true,
    admin: req.user._id,
  });

  if (!groupChat) {
    throw new ApiError(500, "Internal server Error while creating group chat!");
  }

  //structure chat
  const chat = await Chat.aggregate([
    {
      $match: {
        _id: groupChat._id,
      },
    },
    ...ChatAggeragtion(),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, chat[0], "group Chat created Sucessfully !"));
});

/**
 * Handles request to get details of group details
 * @params : string (ChatId)
 * @returns : group chat with struture
 */
const getDetailsOfGroupChat = asynHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...ChatAggeragtion(),
  ]);

  if (!groupChat[0]) {
    throw new ApiError(404, "group chat does not exist !");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, groupChat[0], "group details fetched!"));
});

/**
 * Handles request to rename group
 * @params : {sting}(chatId)
 * @description : function to rename group name ,
 * @returns : structured chat document of ChatId
 */

const renameGroup = asynHandler(async (req, res) => {
    



});

export { createOneToOneOrGetChat, createGroup, getDetailsOfGroupChat };
