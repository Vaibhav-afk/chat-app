// "global.d.ts" is a special file. Types added her can be used globally in the project without having to import them manually.

type ConversationType = {
  id: string;
  fullName: string;
  profilePic: string;
};

type MessageType = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
};
