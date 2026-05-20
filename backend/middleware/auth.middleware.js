import jwt from "jsonwebtoken"
import prisma from "../lib/db.js"


export const protectRoute=async (req,res,next)=>{
    const token=req.cookies.jwt

    if(!token){
        return res.status(401).json("Unauthorized")
    }
const decoded=jwt.verify(token,process.env.JWT_SECRET)

const user =await prisma.user.findUnique({ where: { id: decoded.userId },
    select: {
    id: true,
    name: true,
    email: true
  } });
// console.log("Decoded user ID from token:", user)
req.user=user
next()
}

export const AssignRole= async(req,res,next)=>{
    const userId=req.user.id;
    const user=await prisma.user.findUnique({where:{id:userId}})
    if(user.active === 0){
        return res.status(403).json("Forbidden: User account is inactive");
    }
    if(user.role!=="admin"){
        return res.status(403).json({
      message: "Forbidden: Admins only",});
    }
    req.userRole = user.role;
    next();
}

