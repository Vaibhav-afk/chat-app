import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

//regular http server
const server = http.createServer(app);

//socket.io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap: { [key: string]: string } = {}; //{userId: socketId}

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //io.emit() used to send events to all the connected users or clients that current user is connected, "getOnlineUser" is custom event name we can name anything.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //socket.on() used to listen to events, can be used both on client and server.
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
