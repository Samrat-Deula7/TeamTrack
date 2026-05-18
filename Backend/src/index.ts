import express, { Application, Request, Response } from "express";
import tasksRouter from "./routes/Task";
import teamtaskRouter from "./routes/TeamTask"
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// app.use(cors())

// const allowedOrigins = [
//   "http://localhost:5174",
//   "https://your-frontend-domain.vercel.app"
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

app.use(
  cors({
    origin: "http://localhost:5174", // frontend dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.options("*", cors());
app.use(express.json())

// app.use(cors())
app.use("/api/tasks", tasksRouter);
app.use("/api/teamtasks", teamtaskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
