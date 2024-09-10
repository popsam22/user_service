import { JwtPayload } from "jsonwebtoken";
import { Express } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}
