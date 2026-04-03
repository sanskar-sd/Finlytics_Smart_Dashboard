import mongoose from "mongoose";


const recordSchema = new mongoose.Schema(
    {
        amount:{
            type:Number, 
            required:true},

        type:{
            type:String, enum:["income","expense"], required:true},

        category:{
            type:String, 
            required:true,
            trim:true},

        date:{
            type:Date, 
            required:true},

        notes:{
            type:String, 
            trim:true},

        organizationId:{
            type: mongoose.Schema.Types.ObjectId, ref:"Organization",
            required:true},

        createdBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User",
            required:true},

        isDeleted:{
            type:Boolean, 
            default:false},
    },

    {timestamps:true}

);

export default mongoose.model("Record", recordSchema);