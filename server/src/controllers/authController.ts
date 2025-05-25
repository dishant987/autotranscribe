import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 422 Unprocessable Entity for missing fields
    if (!firstName || !email || !password) {
      res.status(422).json({ message: "Required fields are missing." });
      return;
    }

    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      // 409 Conflict when the email already exists
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = lastName ? `${firstName} ${lastName}` : firstName;

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 201 Created
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err: any) {
    // 500 Internal Server Error
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully" });
};
