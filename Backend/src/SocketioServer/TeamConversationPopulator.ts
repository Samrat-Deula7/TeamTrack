import SocketUserAuth from "./SocketUserAuth";
import express, { Request, Response } from "express";
import { body,validationResult } from "express-validator";
import { pool } from "../routes/Task";

const ConversationRouter = express.Router();

ConversationRouter.post("/talk",[
  body(
    "mess",
    "Cannot be empty",
  ).isLength({min:1})
], async (req: Request, res: Response) => {
  // The above array will set the restrictions rules and the following code will give error if those rules are broken.
  const errors = validationResult(req);
  // If error is empty is false then there is error so the if statement cathes the error.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
