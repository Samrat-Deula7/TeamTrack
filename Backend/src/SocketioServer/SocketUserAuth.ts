import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { pool } from "../routes/Task";

const SocketUserAuth = async (auth: string, teamName: string) => {
  try {
    const data = jwt.verify(auth, process.env.JWT_SECRET!) as {
      user: { id: string };
    };
    const userId = parseInt(data.user.id);

    let insertQuery = `
      SELECT team_id from team_table WHERE team_name = $1;
    `;
    let value = [teamName];

    const teamId = await pool.query(insertQuery, value);

    let team_id = teamId.rows[0].team_id;
    let user_id = userId;

   


    return { team_id, user_id };
  } catch (error) {}
};

export default SocketUserAuth;
