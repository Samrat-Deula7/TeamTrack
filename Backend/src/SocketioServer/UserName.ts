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

   
    let userNameQuery = `
      SELECT name FROM user_table WHERE user_id = $1
    `;
    let userNameValue = [userId];

    const userName = await pool.query(userNameQuery, userNameValue);

    let user_name = userName.rows[0].name;

    if (userName == undefined) {
      user_name = "";
    }


    return  user_name ;
  } catch (error) {}
};

export default SocketUserAuth;
