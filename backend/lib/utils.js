import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';

const generateToken = (userId,res) => {
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"5h"})

    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV!=="development",
        sameSite:"lax",
        maxAge:5*60*60*1000
    })
    return token
  };

export {generateToken}