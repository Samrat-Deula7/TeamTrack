import SocketUserAuth from "./SocketUserAuth";
import express, { Request, Response } from "express";
import { pool } from "../routes/Task";

const ConversationRouter = express.Router();

ConversationRouter.post("/talk", async (req: Request, res: Response) => {
  const token = req.header("FlowTrackAuthtoken");
  let authData = await SocketUserAuth(token!);

  res.status(200).json({ success: [authData?.team_id, authData?.user_name] });
});
export default ConversationRouter;
