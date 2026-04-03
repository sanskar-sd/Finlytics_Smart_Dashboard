import User from "../models/userModel.js";
import Organization from "../models/organizationModel.js";
import bcrypt from "bcryptjs";


// [1] CREATE ROLES
//admin can create roles..(admin,iewer,analyst)
export const adminCreateRole = async (data,admin)=>{
    const{name,email,password,role}=data;

    //only admin is allowed
    if(admin.role !== "admin") {
        throw Error("only admin can create users");
    }

    //validate role..anything except below roles are entered then return invalid roles
    if(!["admin","analyst","viewer"].includes(role)){
        throw Error("Invalid role");
    }

    //check if user already exist
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new Error("User already exist");
    }

    //Hash password
    const hashPassword = await bcrypt.hash(password,10);

    //create user with define role
    const user = await User.create({
        name,
        email,
        password: hashPassword,
        role,
        organizationId: admin.organizationId
    })

    user.password = undefined;
    return user;
}






// [2] GET ALL USERS
//if admin wats to collect all useres in his organization then only admin can access this route
export const getusers = async (admin) =>{
    if(admin.role !== "admin") {
        throw Error ("only admin can view users");
    }

    //give me all users belonging to this organization of admin

    // name  role  organization     password
    // abc   admin     org1     [X] pass not allow
    // xyz   viewer    org1     [X] pass not allow
    // pqr   analyst   org1     [X] pass not allow
    // lmn   admin     org1     [X] pass not allow
    return await User.find({organizationId:admin.organizationId}).select("-password"); //.select(-password)...this will not let password show in table when we get all users
};






// [3] UPDATE USER ROLE
// admin can update user role
export const updateRole = async(userId,role,admin) =>{
    if(admin.role!=="admin"){
        throw new Error("only admin can update user role");
    }

    if(!["admin","analyst","viewer"].includes(role)){
        throw new Error("Invalid role");
    }

    const user = await User.findById(userId);
    if(!user){
        throw new Error("User not found")
    }

    //update role and save
    user.role = role;
    await user.save();

    user.password = undefined;
    return user;
}



// [4] ACTIVATE/DEACTIVATE USER
export const updateStatus = async (userId,status,admin)=>{
    if(admin.role!=="admin"){
        throw new Error("only admin can update status");
    }

    if(!["active","inactive"].includes(status)){
        throw new Error("Invalid Status")
    }

    const user = await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }

    //update status and save
    user.status=status;
    await user.save();

    user.password = undefined;
    return user;
}