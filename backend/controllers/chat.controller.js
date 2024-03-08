import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import Chat from "../models/chat.model.js";
import asynHandler from "express-async-handler";
import Chatmessage from "../models/chatMessage.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { io } from "../socket/index.js";

/**
 * @description : to structure chat model as our requirement
 * @returns : array of aggeragtion pipelines stages ;
 */
export const ChatAggeragtion = () => {
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
        _id: {
          $ne: new mongoose.Types.ObjectId(req.user._id),
        },
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
    return res.status(404).json(new ApiError(404, "reciver does not exist !"));
  }

  if (reciver._id.toString() == req.user._id.toString()) {
    return res
      .status(400)
      .json(new ApiError(400, "you can not chat with your self!"));
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        isGroup: false,
        $and: [
          {
            members: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(req.user._id),
              },
            },
          },
          {
            members: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(reciverId),
              },
            },
          },
        ],
      },
    },
    ...ChatAggeragtion(),
  ]);
  console.log(chat[0]);

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

  const payload = createdChat[0];

  if (!createdChat[0]) {
    return res.status(500).json(new ApiError(500, "Internal server Error!"));
  }

  createdChat[0].members.forEach((member) => {
    if (member._id != req.user._id) {
      io.to(member._id.toString()).emit("new chat", payload);
    }
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdChat[0], "Chat created successfully"));
});

/**
 * Handles request to handle delete one to onme chat
 * @params :  { string } chatId
 * @description : function to deleteone to one chat
 * @returns : only message
 * @routes : api/chat/c/:chatId (DELETE)
 */
const deleteOneToOneChat = asynHandler(async (req, res) => {
  const { chatId } = req.params;

  // check for chat existence
  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroup: false,
      },
    },
    ...ChatAggeragtion(),
  ]);

  console.log(chat);

  if (!chat[0]) {
    return res.status(404).json(new ApiError(404, "Chat does not exist"));
  }

  chat[0]?.members.forEach((member) => {
    io.in(member._id.toString()).emit("delete-chat", chat[0]);
  });

  const deletedChat = await Chat.deleteOne(chat[0]._id);
  console.log(deletedChat);
  await deleteCascadeMessages(chatId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "deleted one to one Chat !"));
});

/**
 * Handles request to create group
 * @req[body] : groupname , members array
 * @returns : created group chat
 * @description : to craete group chat
 * @routes : api/chat/group (POST)
 */
const createGroup = asynHandler(async (req, res) => {
  let { name, members } = req.body;

  if (!name) {
    return res.status(400).json(new ApiError(400, "name field required!"));
  }
  if (!members) {
    return res
      .status(400)
      .json(new ApiError(400, "members array is required!"));
  }
  if (members.includes(req.user._id.toString())) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "group creator is alredy member of group so don't pass it !"
        )
      );
  }

  members = [...new Set([...members, req.user._id.toString()])];
  members = members.map((id) => new mongoose.Types.ObjectId(id));

  if (members.length < 3) {
    return res
      .status(400)
      .json(new ApiError(400, "To create group minimum 3 memebers required!"));
  }

  const groupChat = await Chat.create({
    name,
    members: members,
    isGroup: true,
    admin: req.user._id,
  });

  if (!groupChat) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal server Error while creating group chat!")
      );
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

  chat[0]?.members?.forEach((member) => {
    if (member._id != req.user._id) {
      io.to(member._id.toString()).emit("new chat", chat[0]);
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, chat[0], "group Chat created Sucessfully !"));
});

/**
 * Handles request to get details of group details
 * @params : string (ChatId)
 * @returns : group chat with struture
 * @routes : api/chat/group/:chatId (GET)
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
    return res
      .status(404)
      .json(new ApiError(404, "group chat does not exist !"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, groupChat[0], "group details fetched!"));
});

/**
 * Handles request to rename group
 * @params : {sting}(chatId)
 * @req[body] : new name of group
 * @description : function to rename group name ,
 * @returns : structured chat document of ChatId
 * @routes : api/chat/group/:chatId (PATCH)
 */
const renameGroup = asynHandler(async (req, res) => {
  const { chatId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json(ApiError(400, "name is requied!"));
  }

  const group = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroup: true,
      },
    },
  ]);

  if (!group[0]) {
    return res.status(404).json(new ApiError(404, "group does not exist !"));
  }
  if (group[0].admin.toString() !== req.user._id.toString()) {
    return res.status(401).json(new ApiError(401, "you are not admin!"));
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        name: name,
      },
    },
    {
      new: true,
    }
  );

  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroup._id,
      },
    },
    ...ChatAggeragtion(),
  ]);

  if (!groupChat[0]) {
    return res.status(500).json(new ApiError(500, "INternal server Error!"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, groupChat[0], "group renamed successfully!"));
});

/**
 * Handles request to delete group chat
 * @params : {string} (chatId)
 * @description : function to delete group chat
 * @returns : only message
 * @routes : api/chat/group/:chatId (DELETE)
 */
const deleteGroup = asynHandler(async (req, res) => {
  const { chatId } = req.params;
  const group = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroup: true,
      },
    },
  ]);

  if (!group[0]) {
    return res.status(404).json(new ApiError(404, "group not found!"));
  }

  if (group[0].admin.toString() !== req.user._id.toString()) {
    return res.status(401).json(new ApiError(401, "you are not admin!"));
  }
  const chat = group[0];
  group[0].members?.forEach((member) => {
    io.in(member._id.toString()).emit("delete-chat", chat);
  });

  const groupDelete = await Chat.deleteOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroup: true,
  });

  await deleteCascadeMessages(chatId);

  return res.status(200).json(new ApiResponse(200, {}, "Group deleted!"));
});

/**
 * Handles request to add memebe in group
 * @params : {string} (chatId , memberId )
 * @description : add members to group chat
 * @returns : updated chat model documents (structued)
 * @routes : api/chat/group/:chatId/add/:memberId  (DELETE)
 */
const addMemberInGroupChat = asynHandler(async (req, res) => {
  const { chatId, memberId } = req.params;

  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroup: true,
      },
    },
  ]);

  const user = await User.findById(new mongoose.Types.ObjectId(memberId));

  if (!groupChat[0]) {
    return res.status(404).json(new ApiError(404, "group does not exist !"));
  }

  if (!user) {
    return res.status(404).json(new ApiError(404, "user does not found !"));
  }

  if (groupChat[0].admin.toString() !== req.user._id.toString()) {
    return res.status(401).json(new ApiError(401, "you are not admin !"));
  }
  const members = groupChat[0].members.map((id) => id.toString());

  if (members.includes(memberId)) {
    return res
      .status(400)
      .json(new ApiError(400, "member alredy part of group chat !"));
  }

  const updateGroup = await Chat.findByIdAndUpdate(
    groupChat[0]._id,
    {
      $push: {
        members: new mongoose.Types.ObjectId(memberId),
      },
    },
    {
      new: true,
    }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updateGroup._id,
      },
    },
    ...ChatAggeragtion(),
  ]);

  if (!chat[0]) {
    return res.status(500).json(new ApiError(500, "Internal server Error!"));
  }

  //emit chat-update event for all other memebrs in group to update chat !
  chat[0]?.members.forEach((member) => {
    if (member._id.toString() == memberId) return;
    io.in(member._id.toString()).emit("chat-update", chat[0]);
  });
  const payload = chat[0];
  // memeber which is added emit new-chat event to add event in there context
  io.in(memberId).emit("new chat", payload);

  return res
    .status(200)
    .json(new ApiResponse(200, chat[0], "memebr added successfully!"));
});

/**
 * Handles request to remove member from groupChat
 * @params : {string} (ChatId,memberId)
 * @description : function to remove memeber from goupChat
 * @return : new updated group details
 * @routes : api/chat/group/:chatId/remove/:memberId
 */
const removeMemberFromGroup = asynHandler(async (req, res) => {
  const { chatId, memberId } = req.params;

  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroup: true,
      },
    },
  ]);

  const user = await User.findById(new mongoose.Types.ObjectId(memberId));

  if (!groupChat[0]) {
    return res.status(404).json(new ApiError(404, "group does not exist !"));
  }

  if (!user) {
    return res.status(404).json(new ApiError(404, "user does not found !"));
  }

  if (groupChat[0].admin.toString() !== req.user._id.toString()) {
    return res.status(401).json(new ApiError(401, "you are not admin !"));
  }
  const members = groupChat[0].members.map((id) => id.toString());

  if (!members.includes(memberId)) {
    return res
      .status(400)
      .json(new ApiError(400, "member is not part of group chat !"));
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    groupChat[0]._id,
    {
      $pull: {
        members: new mongoose.Types.ObjectId(memberId),
      },
    },
    {
      new: true,
    }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroup._id,
      },
    },
    ...ChatAggeragtion(),
  ]);

  //update-chat for remaininig group memebers :
  chat[0]?.members.forEach((member) => {
    io.in(member._id.toString()).emit("chat-update", chat[0]);
  });
  //delete-chat from user which is removed :
  io.in(memberId).emit("delete-chat", chat[0]);

  if (!chat[0]) {
    return res.status(500).json(new ApiError(500, "Internal Server Error!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        chat[0],
        "member removed from groupChat successfully!"
      )
    );
});

/**
 * Handles request to leave user to particular group
 * @params : {string} ChatId
 * @descipiotn : function to leave group
 * @returns : structured document of chat model
 * @routes : api/chat/group/leave/:chatId
 */
const leaveGroup = asynHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.findOne({ _id: chatId, isGroup: true });

  if (!groupChat) {
    return res.status(404).json(new ApiError(404, "group does not exist !"));
  }
  const members = groupChat.members.map((id) => id.toString());

  if (!members.includes(req.user._id.toString())) {
    return res
      .status(400)
      .json(new ApiError(400, "you are not part of group!"));
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    groupChat._id,
    {
      $pull: {
        members: req.user._id,
      },
    },
    {
      new: true,
    }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroup._id,
      },
    },
    ...ChatAggeragtion(),
  ]);

  if (!chat[0]) {
    return res.status(500).json(new ApiError(500, "internal server Error !"));
  }

  // emit chat-update event for remaining participate in group
  chat[0].members.forEach((member) => {
    io.in(member._id.toString()).emit("chat-update", chat[0]);
  });
  //now logged in user leave the group so delete chat from logged in user chat's context
  io.in(req.user._id.toString()).emit("delete-chat", chat[0]);

  return res
    .status(200)
    .json(new ApiResponse(200, chat[0], "leave group successfully!"));
});

/**
 * Handles request to fetch all conversation of logged in user    
 * @params : -
 * @desciption : to fetch all conversation in which logged in user is involve
 * @return : strcutued chat []
 * @routes : api/chat
 */
const getAllChats = asynHandler(async (req, res) => {
  const chat = await Chat.aggregate([
    {
      $match: {
        members: {
          $elemMatch: {
            $eq: new mongoose.Types.ObjectId(req.user._id),
          },
        },
      },
    },
    ...ChatAggeragtion(),
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "uses chats fetched !"));
});

export {
  createOneToOneOrGetChat,
  deleteOneToOneChat,
  createGroup,
  getDetailsOfGroupChat,
  renameGroup,
  deleteGroup,
  addMemberInGroupChat,
  removeMemberFromGroup,
  leaveGroup,
  getAllChats,
  seachAvailableUsers,
};
