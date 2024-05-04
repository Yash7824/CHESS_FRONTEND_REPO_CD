import express, { Express, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authorization from "../middleware/authorization";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";
import { FriendRequestDto } from "../dto/FriendRequestDto";

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.jwtSecret;

router.post(
    '/searchFriend', async(req: Request, res: Response) => {
        try{
            let friend = req.query.friend
            const searchFriend = await User.find({ name: { $regex: new RegExp('^' + friend + '$', 'i') } });
            if(!searchFriend) return res.status(400).send('Not Found');
            return res.status(200).json(searchFriend);
        }catch(error: any){
            return res.status(500).send("Internal Server Error");
        }
    }
)

router.post('/sendFriendRequest',
[
    body('friendId', 'Enter Valid FriendId').isLength({min:1}),
],
    authorization,
    async(req: any, res: Response) =>{
        try{
            
            let success = false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
              }

            let currentUser = await User.findById(req.user.id);
            if(!currentUser) return res.status(400).send(`Current User doesn't exists`);

            const {userId, friendId, friend, status} = req.body;
            const friendObject = await User.findOne({id: friendId});

            if(!friendObject) return res.status(400).send('Not Found');
              
            let friendRequest = new FriendRequest({
                userId: req.user.id,
                friendId: friendId,
                status: 'pending'
            })

            let friendRequestDto: FriendRequestDto = {
                userId: req.user.id,
                friendId: friendId,
                user: currentUser.name,
                friend: friendObject.name,
                status: 'pending',
                date: new Date()
            }

            return res.status(200).json(friendRequestDto);
        }catch(error: any){
            return res.status(500).send('Internal Server Error');
        }
    }
)

module.exports = router;