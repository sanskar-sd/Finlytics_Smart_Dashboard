//checks is user is logged in using JWT token and adds user info to req.user

import jwt from "jsonwebtoken";

export const protect = (req,res,next)=>{
    try{
        //get token from header
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "No token provided"});
        }

        const token = authHeader.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        //add user info to req.user
        req.user = decoded;
        next();

    }catch(error){
        return res.status(401).json({message: "Not authorized or Invalid token"});
    }
};