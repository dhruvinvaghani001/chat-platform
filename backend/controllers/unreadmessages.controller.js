import asyncHandler from "express-async-handler";
import UnreadMessage from "../models/UnreadMessage.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utills/ApiResponse.js";

const createOrUpdateUnReadMessages = async ({ userId, messageId, chatId }) => {
  try {
    const alredyHaveUnReadMessages = await UnreadMessage.find({
      user: userId,
      chat: chatId,
    });
    if (alredyHaveUnReadMessages.length != 0) {
      const updateUnreadMessages = await UnreadMessage.findByIdAndUpdate(
        alredyHaveUnReadMessages[0]._id,
        {
          $push: {
            unreadMesssage: messageId,
          },
        },
        {
          new: true,
        }
      );
    } else {
      const newNotification = await UnreadMessage.create({
        user: new mongoose.Types.ObjectId(userId),
        unreadMesssage: [new mongoose.Types.ObjectId(messageId)],
        chat: chatId,
      });
      console.log(newNotification);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUnreadMessageBymember = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $lookup: {
        from: "chatmessages",
        localField: "unreadMesssage",
        foreignField: "_id",
        as: "result",
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
      $project: {
        result: 1,
      },
    },
  ];

  console.log("from unreadmessages");
  console.log(req.user._id);

  console.log("hello");
  const data = await UnreadMessage.find({
    user:new mongoose.Types.ObjectId(req.user._id);
  })

  const unreadMessages = await UnreadMessage.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    ...pipeline,
  ]);

  console.log(unreadMessages);

  const messsages = unreadMessages?.map((iteam) => iteam?.result);

  const allUnreadMessages = messsages?.flat();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allUnreadMessages || [],
        "get all the unread messages :"
      )
    );
});

const deleteUnreadMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const unreadMessage = await UnreadMessage.find({
    user: req.user._id,
  });

  console.log(unreadMessage);

  const findUnreadMessages = await UnreadMessage.deleteMany({
    user: req.user._id,
    chat: chatId,
  });

  console.log(findUnreadMessages);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "delete unread messages"));
});

const addunreadMessage = asyncHandler(async (req, res) => {
  const { userId, chatId, messageId } = req.params;
  console.log("CHECHIMHGN ><>>>");
  try {
    const alredyHaveUnReadMessages = await UnreadMessage.find({
      user: userId,
      chat: chatId,
    });
    console.log("CHECHIMHGN 2");
    console.log(alredyHaveUnReadMessages);
    if (alredyHaveUnReadMessages.length != 0) {
      const updateUnreadMessages = await UnreadMessage.findByIdAndUpdate(
        alredyHaveUnReadMessages[0]._id,
        {
          $push: {
            unreadMesssage: messageId,
          },
        },
        {
          new: true,
        }
      );
    } else {
      const newNotification = await UnreadMessage.create({
        user: new mongoose.Types.ObjectId(userId),
        unreadMesssage: [new mongoose.Types.ObjectId(messageId)],
        chat: chatId,
      });
      console.log(newNotification);
    }
  } catch (error) {
    console.log(error);
  }
});

const addBulk = asyncHandler(async (req, res) => {
  const { values, userId } = req.body;

  const convertedData = values.map((item) => ({
    user: new mongoose.Types.ObjectId(userId),
    chat: new mongoose.Types.ObjectId(item.chatId),
    unreadMesssage: item.messageIds.map(
      (msgId) => new mongoose.Types.ObjectId(msgId)
    ),
  }));

  console.log("convetyred chat data to bulk");
  console.log(convertedData);

  const a = await UnreadMessage.insertMany(convertedData);

  return res.status(200).json(new ApiResponse(200, a || [], "added"));
});

export {
  getUnreadMessageBymember,
  deleteUnreadMessages,
  createOrUpdateUnReadMessages,
  addunreadMessage,
  addBulk,
};
