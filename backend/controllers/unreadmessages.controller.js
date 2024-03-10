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

  const unreadMessages = await UnreadMessage.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    ...pipeline,
  ]);

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

export {
  getUnreadMessageBymember,
  deleteUnreadMessages,
  createOrUpdateUnReadMessages,
  addunreadMessage,
};
