const mongoose = require('mongoose');

//MODELS
const Seller = require('../model/sellerModal');

//UTILS
const log = require('../util/logger')


/***Read Queries***/
async function readSellerByEmail(email){ 
    var user=null;
    var data ={
        email:email
    };
    try{
       await Seller.findOne(data,function(err,result){
        if(!err){
            user=result;
        } 
        });
    }catch(err){
        log.dbLog('readUser:' + email, err);
    } 
    return user;
}
async function readSellerById(uuid){ 
    var user=null;
    console.log(uuid);
    var data ={
        uuid:uuid
    };
    try{
       await Seller.findOne(data,function(err,result){
         console.log(result);  
        if(!err){
            user=result; 
        } 
        });

    }catch(err){
        log.dbLog('readUser:' + id, err);
    } 
    return user;
}

/***Write Queries ***/
async function createSeller(email,password,id){
    var db_user;
    let uuid = mongoose.Types.ObjectId(id);
         let seller = new Seller({
            id:id,
            uuid:uuid,
            email:email,
            password:password
        });
    await seller.save().then((user)=>{
        console.log("User saved successfully");
        db_user=user;
        return user;
    }).catch((err)=>{
        console.log("Error while adding user to db")  
        throw new Error(err);
        return null;
    }); 
    return db_user;
}
module.exports={
    createSeller,
    readSellerByEmail,
    readSellerById
}