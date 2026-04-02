import User from "models/userModel.js";
import Organization from "models/organizationModel.js";
import bcrypt from "bcrypt";
import generateToken from "utils/generateToken.js";

//register first admin
export const registerAdmin = async (data) => {
    const {name,email,password,organizationName} = data;

    //check if user already exists
    const existingAdmin = await User.findOne({role:"admin"});

    if(existingAdmin){
        throw new Error("Admin already exists");
    }

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
    
    return{
        user,
        token: generateToken(user),
    };
};



//login
export const loginUser = async ({email,password}) =>{

    const user = await User.findOne({email});

    if(!user) throw Error("User not found");

    if(user.status === "inactive") throw Error("User is inactive");

    const isMatch = await bcrypt.comaper(password,user.password);

    if(!isMatch) throw Error("Invalid credentials");

    return {
        user,
        token: generateToken(user),
    };

}










