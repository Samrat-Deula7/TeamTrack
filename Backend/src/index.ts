import express, { Application, Request, Response } from "express";
import tasksRouter from "./routes/Task";
import teamtaskRouter from "./routes/TeamTask";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import teamConversation from "./SocketioServer/TeamConversationPopulator";
import SocketUserAuth from "./SocketioServer/SocketUserAuth";

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
app.use(express.json());

// app.use(cors())
app.use("/api/tasks", tasksRouter);
app.use("/api/teamtasks", teamtaskRouter);

// route for socket api
app.use("/api/conversation", teamConversation);
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
  let userName = await SocketUserAuth(token);
  let name = userName?.user_name;

  // Join a room
  socket.on("join-team", (teamName) => {
    socket.join(teamName);
    console.log(`${socket.id} joined team ${teamName}`);
  });

  // Send message to everyone in the room except the sender
  socket.on("send-message", ({ teamName, message }) => {
    socket.to(teamName).emit("receive-message", {
      message: message,
      userName: name,
    });
    console.log(message);
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

export default app;
