import express, { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import authorization from "../middleware/authorization";
import UserFull from "../models/UserFull";

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.jwtSecret;

router.get('/getAllUsers', async(req: any, res: Response) => {
    try{
        const users = await User.find();
        return res.status(200).json(users);
    }catch(error: any){
        return res.status(500).send('Internal Server Error');
    }
})

router.get('/getAllUserFullDetails', async(req: any, res: Response) => {
    try{
        const userFulls = await UserFull.find();
        return res.status(200).json(userFulls);
    }catch(error: any){
        return res.status(500).send('Internal Server Error'); 
    }
})

module.exports = router;