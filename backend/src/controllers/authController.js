import { loginUser, registerAdmin } from "../services/authService.js"


//Register Admin
export const register = async(req,res,next)=>{
    try{
        const data = await registerAdmin(req.body);
        
        res.status(201).json({
            success:true,
            message:"Admin registered successfully",
            ...data,
        });
    }catch(error){
        next(error);
    }
};



// login (all users)
export const login = async (req,res,next) => {
    try{
        const data = await loginUser(req.body);

        res.status(200).json({
            success:true,
            message:"Login successful",
            ...data,
        })
    }catch(error){
        next(error);
    }
};