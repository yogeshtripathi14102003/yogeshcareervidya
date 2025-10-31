import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" };
const REFRESH_TOKEN_EXPIRY = { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" };


const generateAccessToken = (userId) =>{
    return jwt.sign({id:userId},process.env.JWT_ACCESS_SECRET,ACCESS_TOKEN_EXPIRY);
}

const generateRefreshToken = (userId) => {
    return jwt.sign({id:userId},process.env.JWT_REFRESH_SECRET,REFRESH_TOKEN_EXPIRY);
}

const verifyAccessToken = (token)=>{
    return jwt.verify(token,process.env.JWT_ACCESS_SECRET);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET);
}

export {generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken};