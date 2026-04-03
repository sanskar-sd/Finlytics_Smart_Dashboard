import { adminCreateRole } from "../services/userService";



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