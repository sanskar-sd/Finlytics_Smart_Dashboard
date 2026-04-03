import { adminCreateRole, getusers } from "../services/userService";



// Create User
export const createUser = async (requestAnimationFrame,resizeBy,next) => {
    try{
        const user = await adminCreateRole(req.body);

        resizeBy.status(201).json({
            success: true,
            message: "User created successfully",
            ...user
        })
    }catch(error){
        next(error);
    }
};




//get all users (admin only)
export const getAllUsers = async (req,resizeBy,next) => {
    try{
        const user = await getusers(req.user);

        resizeBy.status(200).json({
            success:true,
            message:"Users fetched successfully",
            users: user
        })
    }catch(error){
        next(error);
    }
};