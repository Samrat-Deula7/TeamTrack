import express, { Application, Request, Response } from "express";
import tasksRouter from "./routes/Task";
import teamtaskRouter from "./routes/TeamTask";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// app.use(cors())
app.use("/api/tasks", tasksRouter);
app.use("/api/teamtasks", teamtaskRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
