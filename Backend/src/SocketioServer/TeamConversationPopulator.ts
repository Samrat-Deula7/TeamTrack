import SocketUserAuth from "./SocketUserAuth";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../routes/Task";

const ConversationRouter = express.Router();

ConversationRouter.post("/talk", async (req: Request, res: Response) => {
  try {
    const token = req.header("FlowTrackAuthtoken");
    const { mess, teamName, mediaId } = req.body;

    if (mess != "") {
      let authData = await SocketUserAuth(token!, teamName);

      if (mediaId == null) {
        const insertQuery = `
      INSERT INTO team_conversation (team_id,user_id,conversation)
      VALUES ($1,$2,$3);
    `;
        const values = [authData?.team_id, authData?.user_id, mess];
        await pool.query(insertQuery, values);
        res.status(200).json({ success: "conversation saved" });
      } else {
        const insertQuery = `
      INSERT INTO team_conversation (team_id,user_id,media_id,conversation)
      VALUES ($1,$2,$3,$4);
    `;
        const values = [authData?.team_id, authData?.user_id, mediaId, mess];
        await pool.query(insertQuery, values);
        res.status(200).json({ success: "conversation saved" });
      }
    } else {
      res.status(200).json({ success: "conversation saving avoided" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "unable to populate conversation.",
    });
  }
});

ConversationRouter.get("/getalltalk", async (req: Request, res: Response) => {
  try {
    const token = req.header("FlowTrackAuthtoken");
    const teamName = req.query.teamName as string;

    let data = await SocketUserAuth(token!, teamName);

    const getQuery = `
      SELECT 
          u.name,
          t.conv_id,
          t.team_id,
          t.user_id,
          t.conversation,
          m.media_type,
          m.media_data,
          m.media_name
      FROM user_table u
      FULL JOIN team_conversation t 
          ON u.user_id = t.user_id
      FULL JOIN send_media m 
          ON t.media_id = m.media_id
      WHERE t.team_id = $1 
      Order by t.conv_id;     
      `;
    const values = [data?.team_id];

    let allConv = await pool.query(getQuery, values);

    res.status(200).json({
      success: allConv.rows,
      userId: data?.user_id as number,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "unable to get all conversations.",
    });
  }
});
export default ConversationRouter;
