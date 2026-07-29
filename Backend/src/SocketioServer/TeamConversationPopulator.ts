import SocketUserAuth from "./SocketUserAuth";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../routes/Task";

const ConversationRouter = express.Router();

ConversationRouter.post(
  "/talk",
  [body("mess", "Cannot be empty").isLength({ min: 1 })],
  async (req: Request, res: Response) => {
    // The above array will set the restrictions rules and the following code will give error if those rules are broken.
    const errors = validationResult(req);
    // If error is empty is false then there is error so the if statement cathes the error.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const token = req.header("FlowTrackAuthtoken");
      const { mess, teamName } = req.body;

      let authData = await SocketUserAuth(token!, teamName);

      const insertQuery = `
      INSERT INTO team_conversation (team_id,user_id,conversation)
      VALUES ($1,$2,$3);
    `;
      const values = [authData?.team_id, authData?.user_id, mess];
      await pool.query(insertQuery, values);

      res.status(200).json({ success: "conversation saved" });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "unable to populate conversation.",
      });
    }
  },
);

ConversationRouter.get("/getalltalk", async (req: Request, res: Response) => {
  try {
    const token = req.header("FlowTrackAuthtoken");
    const  teamName  = req.query.teamName as string;

    let data = await SocketUserAuth(token!, teamName);

    const getQuery = `
        SELECT * from team_conversation WHERE team_id = $1 and user_id =$2;
      `;
    const values = [data?.team_id, data?.user_id];
    console.log(data?.team_id);
    console.log(data?.user_id);

    let allConv = await pool.query(getQuery, values);

    console.log(data?.team_id);
    console.log(data?.user_id);
    console.log(allConv.rows);
    console.log(allConv.rowCount);

    res.status(200).json({
      success: allConv.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "unable to get all conversations.",
    });
  }
});
export default ConversationRouter;
