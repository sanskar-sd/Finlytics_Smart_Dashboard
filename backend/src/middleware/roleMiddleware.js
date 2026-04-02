//allow only specific roles



export const authorizeRoles = (...allowedRoles) =>{

    //check role of user and if role is not in allowed roles then return forbidden error
    return(req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({message: "Forbidden: You don't have permission to access this resource"});
        }
        next();
    };
};