import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization token is required." });
  }
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.JWTSECRET!);
    req.user = verifiedUser;
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token");
  }
};

export default auth;
