import { createRecord, deleteRecord, getRecords, updateRecord } from "../services/recordService.js";



// [1] Create Record
export const addRecord = async (req,res,next)=>{
    try{
        const record = await createRecord(req.body,req.user);

        res.status(201).json({
            success:true,
            message:"Record created successfully",
            record
        })
    }catch(error){
        next(error);
    }
};



// [2] Get Records(with Filters)
export const getALLRecords = async (req,res,next)=>{
    try{
        const records = await getRecords(req.user,req.query);

        res.status(200).json({
            success:true,
            message:"Records fetched successfully",
            records
        })
    }catch(error){
        next(error);
    }
};



// [3]Update Record
export const editRecord = async (req,res,next) =>{
    try{
        const record = await updateRecord(req.params.id,req.body,req.user);

        res.status(200).json({
            success:true,
            message:"Record updated successfully",
            record
        })
    }catch(error){
        next(error);
    }
};



// [4] Delete Record (Soft Delete)
export const removeRecord = async (req,res,next) =>{
    try{
        const result = await deleteRecord(req.params.id,req.user);

        res.status(200).json({
            success:true,
            message:"Record deleted successfully",
            ...result
        })
    }catch(error){
        next(error);
    }
};