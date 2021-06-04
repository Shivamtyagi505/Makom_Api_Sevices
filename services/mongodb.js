const mongoose = require('mongoose');

//MODELS
const Seller = require('../model/sellerModal');

//UTILS
const log = require('../util/logger')


/***Read Queries***/
async function readSeller(email){ 
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

/***Write Queries ***/
async function createSeller(email,password){
         let seller = new Seller({
            email:email,
            password:password
        });
    await seller.save().then((user)=>{
        return "Seller successfully created";
    }).catch((err)=>{
        throw new Error(err);
        return null;
    }); 
}
module.exports={
    createSeller,
    readSeller
}