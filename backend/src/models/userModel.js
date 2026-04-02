import mongoose from "mongoose";
import { ROLES } from "../utils/constants.js";
import organizationModel from "./organizationModel.js";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true},

        email:{
            type:String, 
            required:true,
            unique:true},

        password:{
            type:String, 
            required:true},
        
        role:{
            type:String, 
            enum:["admin","analyst","viewer"],default:"active"},
        
        status:{
            type:String, 
            enum:["active","inactive"],
            default:"active"},

        organizationId:{
            type: mongoose.Schema.Types.ObjectId, ref:"Organization",
            required:true},
    },

    {timestamps:true}
    
);

export default mongoose.model("User", userSchema);