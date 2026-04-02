import User from "../models/userModel.js";
import Organization from "../models/organizationModel.js";
import bcrypt from "bcryptjs";


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
    const existingUser = await User.findOne(email)
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
