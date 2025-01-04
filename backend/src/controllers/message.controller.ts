import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.ts";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await prisma.conversation.findFirst({
      where: { participantIds: { hasEvery: [senderId, receiverId] } },
    });

    //Start of the conversation with the user; thats why new conversation is created.
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: { set: [senderId, receiverId] },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    
    //If receiver socket id is present in socketMap
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.log("Error in sendMessage controller", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id: userToChatWithId } = req.params;
    const senderId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatWithId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(201).json(conversation.messages);
  } catch (error: any) {
    console.log("Error in getMessages controller", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};

//It fetches all the chats for currently logged in user
export const getAllChats = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id; //currently login or authenticated user

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true,
      },
    });

    res.status(200).json(users);
  } catch (error: any) {
    console.log("Error in getAllChats controller", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};
