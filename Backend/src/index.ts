import express, { Application, Request, Response } from "express";
import tasksRouter from "./routes/Task";
import teamtaskRouter from "./routes/TeamTask";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev frontend
      "https://team-track-3v5z.vercel.app/", // live frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// app.use(cors())
app.use("/api/tasks", tasksRouter);
app.use("/api/teamtasks", teamtaskRouter);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // dev frontend
      "https://team-track-3v5z.vercel.app/", // live frontend
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected : " + socket.id);
});

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

export default app;
