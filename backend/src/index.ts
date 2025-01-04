import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();

const port = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookie

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//for deployment purpose
if(process.env.NODE_ENV !== 'development'){
  app.use(express.static(path.join(__dirname,"./frontend/dist")));
  app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
  })

}

//listening to regular http server instead of an express server
server.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
