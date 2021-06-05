const mongoose = require('mongoose');

//MODELS
const Seller = require('../model/sellerModal');
const Admin = require('../model/adminModal');
const Driver = require('../model/driverModal');

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
//all sellers
async function readAllSellers(){
    var sellers;
    await Seller.find({},function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all drivers");
            sellers =result.map((user) => user.uuid);; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return sellers;
}


//admin
//admin by email
async function readAdminByEmail(email){ 
    var user=null;
    var data ={
        email:email
    };
    try{
       await Admin.findOne(data,function(err,result){
        if(!err){
            user=result;
        } 
        });
    }catch(err){
        log.dbLog('readUser:' + email, err);
    } 
    return user;
}

//read admin by id
async function readAdminById(uuid){ 
    var user=null;
    console.log(uuid);
    var data ={
        uuid:uuid
    };
    try{
       await Admin.findOne(data,function(err,result){
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

//driver by email
async function readDriverByEmail(email){ 
    var user=null;
    var data ={
        email:email
    };
    try{
       await Driver.findOne(data,function(err,result){
        if(!err){
            user=result;
        } 
        });
    }catch(err){
        log.dbLog('readUser:' + email, err);
    } 
    return user;
}

//read driver by id
async function readDriverById(uuid){ 
    var user=null;
    console.log(uuid);
    var data ={
        uuid:uuid
    };
    try{
       await Driver.findOne(data,function(err,result){
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
//all drivers
async function readAllDrivers(){
    var drivers;
    await Driver.find({},function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all drivers");
            drivers =result.map((user) => user.uuid);; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return drivers;
}


/***Write Queries ***/



//seller
async function createSeller(seller){
    var db_user;
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
 


//driver 
async function createDriver(driver){
    var db_user;
    await driver.save().then((user)=>{
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
    readSellerById,
    readAllSellers,
    readAdminByEmail,
    readAdminById,
    readDriverByEmail,
    readDriverById,
    createDriver,
    readAllDrivers
}