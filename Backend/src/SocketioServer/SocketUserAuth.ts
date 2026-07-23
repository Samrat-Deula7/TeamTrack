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
    return userId;

    // const userName = await pool.query(
    //   "Select name from user_table where user_id = $1",
    //   [userId],
    // );
    // return userName.rows[0].name;
  } catch (error) {}
};

export default SocketUserAuth;
