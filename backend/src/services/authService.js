import User from "../models/userModel.js";
import Organization from "../models/organizationModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

//Register Admin
export const registerAdmin = async (data) => {
    const {name,email,password,organizationName} = data;

    //create organization
    const org = await Organization.create({name:organizationName});

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);

    //create admin user
    const user = await User.create({
        name,
        email,
        password:hashedPassword,
        role:"admin",
        organizationId:org._id
    });

    org.createdBy = user._id;
    await org.save();

    //dont pass user directly.. it still got internal fields

    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    
    return{
        user:safeUser,
        token: generateToken(user),
    };
};




//login for admin,viewer,analyst
export const loginUser = async ({email,password}) =>{
    
    //find user by email and check if user exists
    const user = await User.findOne({email});
    if(!user) throw Error("User not found");

    //if user is inactive, throw error
    if(user.status === "inactive") throw Error("User is inactive");

    //compare password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) throw Error("Invalid credentials");

    // remove password before sending
    user.password = undefined;


    //dont pass user directly.. it still got internal fields

    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    return {
        user:safeUser,
        token: generateToken(user),
    };

}
