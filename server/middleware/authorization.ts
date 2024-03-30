import { Request, Response, NextFunction  } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.jwtSecret;

const fetchUser = (req: any, res : Response, next: NextFunction) => {
  // get the id from jwt token and add it to req object
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ msg: 'Not Authorised' });
  
  try {
    // verify the token and fetch the payload which is the data object which has user's id.
    const data: any = jwt.verify(token, jwtSecret ? jwtSecret : '');
    req.user = data.user;

    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(401).json({ msg: 'Not Authorised' });
  }
};

export default fetchUser;