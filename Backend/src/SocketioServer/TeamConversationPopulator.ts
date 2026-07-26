import SocketUserAuth from "./SocketUserAuth";
import express, { Request, Response } from "express";
import { pool } from "../routes/Task";

const ConversationRouter = express.Router();

ConversationRouter.post("/talk", async (req: Request, res: Response) => {
  try {
    const token = req.header("FlowTrackAuthtoken");
    let authData = await SocketUserAuth(token!);

    const { mess } = req.body;

    const insertQuery = `
      INSERT INTO team_conversation (team_id,conversation,team_member)
      VALUES ($1,$2,$3);
    `;
    const values = [authData?.team_id, mess, authData?.user_name];
    await pool.query(insertQuery, values);

    res.status(200).json({ success: "conversation populated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "unable to pupulate conversation.",
    });
  }
});
export default ConversationRouter;
