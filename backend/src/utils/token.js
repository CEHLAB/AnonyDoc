import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
