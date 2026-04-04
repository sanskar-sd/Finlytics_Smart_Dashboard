import Record from "../models/recordModel.js";


// [1] CREATE RECORD (only admin)
export const createRecord = async (data,user)=>{
    if(user.role !=="admin") {
        throw Error("Only admin can create records");
    }

    const record = await Record.create({
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        notes: data.notes,
        organizationId: user.organizationId,
        createdBy: user.id
    });
    return record;
};




// [2] GET RECORDS filter / without filters    
export const getRecords = async (user,filter) =>{

    //get data from DB based on organizationId and isDeleted false
    const query = {
        organizationId: user.organizationId,
        isDeleted:false,
    }

    if(filter.type){
        query.type=filter.type;
    }

    if(filter.category){
        query.category=filter.category;
    }

    if(filter.startDate && filter.endDate){
        query.date={
            $gte: new Date(filter.startDate), //greater than or equal
            $lte: new Date(filter.endDate), //less than or equal
        };
    }

    //find the query and sort by date.
    //(-1)=> newest record first
    //(1)=> oldest record first
    return await Record.find(query).sort({date:-1});
}





// [3] UPDATE RECORD (only admin)
export const updateRecord = async(recordId,data,user)=>{
    if(user.role !== "admin"){
        throw new Error("Only admin can update records");
    }

    const record = await Record.findById(recordId);
    if(!record) throw new Error({"message":"Record not found"});

    //ensure same organization
    if(record.organizationId.toString() !== user.organizationId.toString()){
        throw new Error("Unauthorized to update this record");
    }

    //update the record
    record.amount = data.amount || record.amount;
    record.type = data.type || record.type;
    record.category = data.category || record.category;
    record.date = data.date || record.date;
    record.notes = data.notes || record.notes;

    await record.save();
    return record;
}






// [4] DELETE RECORD (only admin)  ... soft delete
export const deleteRecord = async (recordId,user)=>{

    if(user.role !== "admin"){
        throw new Error("Only admin can delete records");
    }

    const record = await Record.findOne(recordId);
    if(!record) throw new Error({"message":"Record not found"});

    //ensure same organization
    if(record.organizationId.toString() != user.organizationId){
        throw new Error("Unauthorized to delete this record");
    }

    //soft delete by setting isDeleted to true
    record.isDeleted=true;
    await record.save();
    return {"message":"Record deleted successfully"};

}
