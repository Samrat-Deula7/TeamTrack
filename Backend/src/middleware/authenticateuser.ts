import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

// Since the JWT doesn't have user in request we need to provide an custom interface.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string; // or a custom type for your user
    }
  }
}

const authenticateuser = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.header("FlowTrackAuthtoken");
  if (!token) {
    res.status(401).send({ error: "Please provide the authentication token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = data;
    next();
  } catch (error) {
    res.status(401).send({ error: "Plese use an valid authentication token" });
  }
};

export default authenticateuser;
