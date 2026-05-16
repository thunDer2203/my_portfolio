import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateToken } from '../lib/utils.js';
import prisma from '../lib/db.js';
import express from 'express';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password,phone } = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    if(password.length<6){
    return res.status(400).json({message:"Password must be at least 6 characters"})
  }
    const user = await prisma.user.findUnique({ where: { email } });
    if(user){
      return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name:username,
        email,
        password: hashedPassword,
        phone
      },
    });
    const token = generateToken(newUser.id,res);
    res.status(201).send("User registered successfully");
  }
  catch (error) {    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => { 
  try {
  const {email,password}=req.body
  if(!email || !password){
    return res.status(400).json({message:"All fields are required"})
  }
  const user=await prisma.user.findUnique({where:{email}})
  const iscorrect = await bcrypt.compare(password,user.password);
  if(!iscorrect){
    return res.status(400).json({message:"Invalid credentials"})
  }
  const token = generateToken(user.id,res);
  res.status(200).json({message:"Login successful"})
}catch (error) {    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

router.post('/logout',(req,res)=>{
  try{
  res.clearCookie("jwt")
  res.status(200).json({message:"Logged out successfully"})
  }
  catch (error) {    console.error(error);
    res.status(500).json({ message: 'Error Logging Out' });
  }
})

export default router;