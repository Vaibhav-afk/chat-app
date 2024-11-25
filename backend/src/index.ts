import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5001;

const app = express();

app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookie

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
