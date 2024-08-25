import express, { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from 'crypto'
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import authorization from "../middleware/authorization";
import { UpdateUser } from "../dto/UpdateUser";
import UserFull from "../models/UserFull";
import {v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.jwtSecret;

router.post(
  "/signup",
  [
    body("name", "Name must be atleast 3 characters").isLength({ min: 3 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password must be atleast 3 letters").isLength({ min: 3 }),
  ],
  async (req: Request, res: Response) => {
    try {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }

      try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        let userFull = await UserFull.findOne({ email })

        if (user) return res.status(404).send(`User Already exists`);
        if (userFull) return res.status(404).send(`User Already exists`);

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const encrypted = await bcrypt.hash(password, salt);

        // storing the req.body parameters and the secured hash password in the user object.
        user = new User({
          user_id: uuidv4(),
          name: name,
          email: email,
          password: encrypted,
        });

        userFull = new UserFull({
          user_id: user.user_id,
          name: name,
          email: email,
          password_encrypted: encrypted,
          password: password
        })

        const data = { id: user.user_id };

        //token generation
        const authtoken = jwt.sign(data, jwtSecret ? jwtSecret : '');

        await user.save();
        await userFull.save();
        success = true;
        res.status(201).json({ success, authtoken });

      } catch (error: any) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post('/login',
  [
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password must be atleast 3 characters').isLength({ min: 3 })
  ],
  async (req: Request, res: Response) => {
    try {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success, errors: errors.array() });

      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');

        // after the user's email getting matched, compare the req.body.password with the user.password
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) return res.status(400).json({ success, message: 'Please enter correct credentials' });

        const payload = {
          user: { id: user.user_id }
        }

        const authToken = jwt.sign(payload, jwtSecret ? jwtSecret : '');
        success = true;
        return res.status(200).json({authToken})

      } catch (error: any) {
        return res.status(500).send('Server Error');
      }
    } catch (error: any) {
      return res.status(500).send('Internal Server Error');
    }
  })


router.get('/getUser', authorization, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.find({user_id: userId}).select('-password');
    if (!user) return res.status(404).send('User Not found');
    return res.status(200).json(user);

  } catch (error: any) {
    return res.status(500).send('Internal Server Error');
  }

})

// can also user /updateUser/:id 
router.put('/updateUser',
  [
    body("name", "Name must be atleast 3 characters").isLength({ min: 3 }),
    body("password", "Password must be atleast 3 letters").isLength({ min: 3 }),
    body("confirmPassword", "Password must be atleast 3 letters").isLength({ min: 3 })
  ],
  authorization,
  async (req: any, res: Response) => {
    try {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success, errors: errors.array() });
      
      const userId = req.user.id;
      let user = await User.find({user_id: userId});
      if (!user) return res.status(404).send('User Not Found');

      const { name, password, confirmPassword }: UpdateUser = req.body;
      const newUser: any = {}

      if (name) newUser.name = name;
      if (password && password === confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        newUser.password = secPass;
      }

      user = await User.findOneAndUpdate({user_id: userId}, { $set: newUser }, { new: true, upsert: true });
      // user = await User.findByIdAndUpdate(userId, { $set: newUser }, { new: true });
      return res.status(400).json(user);

    } catch (error: any) {
      return res.status(500).send('Internal Server Error');
    }
  })

module.exports = router;
