import express, { Express, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authorization from "../middleware/authorization";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";
import { FriendRequestDto } from "../dto/FriendRequestDto";
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.jwtSecret;

router.post(
    '/searchFriend', async (req: Request, res: Response) => {
        try {
            let friend = req.query.friend
            const searchFriend = await User.find({ name: { $regex: new RegExp('^' + friend + '$', 'i') } });
            if (!searchFriend) return res.status(400).send('Not Found');
            return res.status(200).json(searchFriend);
        } catch (error: any) {
            return res.status(500).send("Internal Server Error");
        }
    }
)

router.post('/sendFriendRequest',
    [
        body('friendId', 'Enter Valid FriendId').isLength({ min: 1 }),
    ],
    authorization,
    async (req: any, res: Response) => {
        try {

            let success = false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }
            const { userId, friendId, friend, status } = req.body;

            if(req.user.id === friendId) return res.status(403).send(`Can't send friend request to self`);

           const currentUser = await User.findById(req.user.id);
            if (!currentUser) return res.status(404).send(`Current User doesn't exists`);
            
            const friendObject = await User.findById(friendId);
            if (!friendObject) return res.status(404).send('Not Found');

            let existingRequest = await FriendRequest.find({ currentUserId: currentUser.id, friendId: friendId });
            if (existingRequest.length !== 0) {
                if (existingRequest[0].status === 'pending') return res.status(400).send('Friend Request Pending');
                return res.status(404).send('Friend Request Already sent')
            }

            let friendRequest = new FriendRequest({
                currentUserId: req.user.id,
                friendId: friendId,
                user: currentUser.name,
                friend: friendObject.name,
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

            await friendRequest.save();
            return res.status(200).json(friendRequestDto);
        } catch (error: any) {
            return res.status(500).send('Internal Server Error: ' + error.message);
        }
    }
)

router.get('/getPendingFriendRequests',
    authorization,
    async(req: any, res: Response) => {
        try {
            let success = false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }

            const currentUser = await User.findById(req.user.id);
            if (!currentUser) return res.status(404).send('Current User not found');

            const friendRequest = await FriendRequest.find({ currentUserId: req.user.id })
            if (friendRequest.length === 0) return res.status(404).send('No Friend Requests found');

            return res.status(200).json(friendRequest);
        } catch (error: any) {
            return res.status(500).send('Internal Server Error');
        }
    }
)

router.post('/respondFriendRequest',
    [
        body('responseToId', 'Enter Valid FriendId').isLength({ min: 1 }),
    ],
    authorization,
    async (req: any, res: Response) => {
        try {
            let success = false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }

            const { responseToId, action } = req.body;
            const currentUser = await User.findOne({ id: req.user.id });
            if (!currentUser) return res.status(404).send('Current User not found');

            const friendRequest = await FriendRequest.findOne({ friendId: req.user.id, currentUserId: responseToId })
            if (!friendRequest) return res.status(404).send('No Friend Requests found');

            if (friendRequest.status === 'pending') {
                friendRequest.status = action;
            }else if(friendRequest.status === 'accept'){
                return res.status(400).send('Request already accepted');
            }else if(friendRequest.status === 'decline'){
                return res.status(403).send('Request was declined');
            }else {
                return res.status(404).send('Invalid');
            }

            if(action === 'decline'){
                await friendRequest.deleteOne({currentUserId: responseToId});
                return res.status(202).send('Friend Request Deleted');
            }

            await friendRequest.save();
            return res.status(200).json(friendRequest);
        } catch (error: any) {
            return res.status(500).send('Internal Server Error');
        }
    })

module.exports = router;