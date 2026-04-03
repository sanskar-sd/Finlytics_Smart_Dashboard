import { adminCreateRole, getusers, updateRole, updateStatus } from "../services/userService";



// [1] Create User
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




// [2] Get all users (admin only)
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



// [3] Update User Role (admin only)
export const changeRole = async (req,resizeBy,next) => {
    try{
        const {userId,role} =  reqbody;
        const user = await updateRole(userId,role,req.user);

        res.status(200).json({
            success:true,
            message:"User role updated successfully",
            user
        });
    }catch(error){
        next(error);
    }
};



// [4] Update Status (Active/Inactive) (admin only)
export const changeStatus = async (req,res,next)=>{
    try{
        const {userId,status} = req.body;
        const user = await updateStatus(userId,status,req.user);

        res.status(200).json({
            success:true,
            message:"User status updated successfully",
            user
        });
    }catch(error){
        next(error);
    }
};