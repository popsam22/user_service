import { Request, Response } from "express";
import { CreateUserDTO, LoginDTO } from "../dtos/user.dto";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export async function createUser(
  req: Request<{}, {}, CreateUserDTO>,
  res: Response
) {
  const { username, password, email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function login(req: Request<{}, {}, LoginDTO>, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password!" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET!, {
      expiresIn: "1d",
    });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function updateUser(req: Request, res: Response) {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "userID is missing" });
  }
  try {
    const updates = req.body;
    if (!updates) {
      return res
        .status(400)
        .json({ error: "fill the necessary fields to make updates" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates);
    return res.status(201).json({ updatedUser });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
