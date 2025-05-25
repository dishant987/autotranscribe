import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

// Extend the Express Request type properly
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

interface JwtPayload {
  id: string;
  name?: string;
  email?: string;
  exp?: number; // optional, if you want to access it manually
}

export const verifyToken = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.userId = decoded.id;
    next();
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  }
};
