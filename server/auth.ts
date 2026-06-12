import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { type User } from "@shared/schema";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// JWT secret key - REQUIRED for security
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is required for security");
  process.exit(1);
}
// Type assertion since we've verified JWT_SECRET exists
const JWT_SECRET_STRING = JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET_STRING,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET_STRING);
  } catch (error) {
    return null;
  }
}

// Middleware to authenticate requests
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  // Get full user data from database
  const user = await storage.getUser(decoded.id);
  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }

  req.user = user;
  next();
}

// Middleware to check user roles
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

// Middleware for admin-only routes
export const requireAdmin = requireRole(['admin']);

// Middleware for admin and editor routes
export const requireEditor = requireRole(['admin', 'editor']);

// Middleware for all authenticated users
export const requireAuth = authenticateToken;