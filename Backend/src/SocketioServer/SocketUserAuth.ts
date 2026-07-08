import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SocketUserAuth = ( auth: string) => {
 
  try {
    const data = jwt.verify(auth, process.env.JWT_SECRET!);
    return data;
  } catch (error) {
  }
};

export default SocketUserAuth;
