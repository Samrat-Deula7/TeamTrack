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

    let insertQuery = `
      SELECT team_id from team_table WHERE user_id = $1;
    `;
    let value = [userId];

    const teamId = await pool.query(insertQuery, value);

    let team_id = teamId.rows[0].team_id;
    let user_id = userId;

    // let teamNameQuery = `
    //   SELECT team_name  FROM team_table WHERE team_id=$1
    // `
    // let teamNameValue = [ team_id ]

    // const teamName = await pool.query(teamNameQuery,teamNameValue)

    // let team_name = teamName.rows[0].team_name

    // let userNameQuery=`
    //   SELECT name FROM user_table WHERE user_id = $1
    // `
    // let userNameValue= [ user_id ]

    // const userName = await pool.query(userNameQuery,userNameValue);

    // let user_name = userName.rows[0].name

    // return { team_id, user_id, team_name, user_name };

    let userNameQuery = `
      SELECT name FROM user_table WHERE user_id = $1
    `;
    let userNameValue = [user_id];

    const userName = await pool.query(userNameQuery, userNameValue);

    let user_name = userName.rows[0].name;

    return { team_id, user_id, user_name };

    // const userName = await pool.query(
    //   "Select name from user_table where user_id = $1",
    //   [userId],
    // );
    // return userName.rows[0].name;
  } catch (error) {}
};

export default SocketUserAuth;
