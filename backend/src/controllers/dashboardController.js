import { getDashboardData } from "../services/dashboardService";



//Get Dashboard Data
export const getDashboard = async (req,res,next) =>{
    try{
        const data = await getDashboardData(req.user);

        res.status(200).json({
            success:true,
            message:"Dashboard data fetched successfully",
            ...data
        })
    }catch(error){
        next(error);
    }
};