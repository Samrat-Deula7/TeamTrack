import express, { Application, Request, Response } from "express";
import tasksRouter from "./routes/Task";
import teamtaskRouter from "./routes/TeamTask";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import teamConversation from "./SocketioServer/TeamConversationPopulator";
import MediaRouter from "./SocketioServer/MediaPopulator";
import UserName from "./SocketioServer/UserName";
import { Socket } from "dgram";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// this is my express server

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev frontend
      "https://team-track-3v5z.vercel.app", // live frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// app.use(express.json());

// app.use(cors())
app.use("/api/tasks", express.json(), tasksRouter);
app.use("/api/teamtasks", express.json(), teamtaskRouter);

// route for socket api
app.use("/api/conversation", express.json(), teamConversation);
app.use("/api/upload", MediaRouter);
// This is the socket server

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // dev frontend
      "https://team-track-3v5z.vercel.app", // live frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("a user connected : " + socket.id);
  const token = socket.handshake.auth.token;
  let userName = await UserName(token);

  // Join a room
  socket.on("join-team", (teamName) => {
    socket.join(teamName);
    console.log(`${socket.id} joined team ${teamName}`);
  });

  // Send message to everyone in the room except the sender
  socket.on("send-message", ({ teamName, message, MediaData }) => {
    socket.to(teamName).emit("receive-message", {
      message: message,
      userName: userName,
      MediaData: MediaData,
    });
    console.log(message);
  });

  socket.on("typing", ({ teamName }) => {
    socket.to(teamName).emit("sendingText", {
      userName: userName,
    });
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

export default app;
