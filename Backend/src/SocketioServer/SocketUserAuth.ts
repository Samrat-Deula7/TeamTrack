import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { pool } from "../routes/Task";

const SocketUserAuth = async (auth: string) => {
  try {
    const data = jwt.verify(auth, process.env.JWT_SECRET!) as {
      user: { id: string };
    };
    const userId = parseInt(data.user.id);
    let userQuery = `
      SELECT name from user_table WHERE user_id = $1;
    `;
    let userIdValue = [userId];

    const userName = await pool.query(userQuery, userIdValue);

    let insertQuery = `
      SELECT team_id from team_table WHERE user_id = $1;
    `;
    let value = [userId];

    const teamId = await pool.query(insertQuery, value);

    console.log("From socket")
    console.log(teamId.rows[0].team_id, userName.rows[0].name);
    let team_id = teamId.rows[0].team_id;
    let user_name = userName.rows[0].name;
    return {team_id,user_name};

    // const userName = await pool.query(
    //   "Select name from user_table where user_id = $1",
    //   [userId],
    // );
    // return userName.rows[0].name;
  } catch (error) {}
};

export default SocketUserAuth;
