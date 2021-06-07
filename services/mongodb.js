const mongoose = require('mongoose');

//MODELS
const Seller = require('../model/sellerModal');
const Admin = require('../model/adminModal');
const Driver = require('../model/driverModal');
const Order = require('../model/orderModal')

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
 //update seller data
async function UpdateSeller(user,name,phone,address,city,state){
    try { 
        if (name) {
          user.name = name;
        }
        if (phone) {
          user.phone = phone;
        }
        if (address) {
          user.address = address;
        }
        if (city) {
          user.city = city;
        }
        
        if (state) {
            user.state = state;
          } 
        await user.save();
        return user;
      } catch (err) {
        log.dbLog('updateUser:' + uuid, err);
        return null;
      }
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

 
//admin restricted APIs
async function ChangeSellerStatus(seller){
    var db_user;
    await seller.save().then((user)=>{
        console.log("seller status changed successfully");
        db_user=user;
        return user;
    }).catch((err)=>{
        console.log("Error while adding user to db")  
        
        throw new Error(err);
        return null;
    }); 
    return db_user;
}

 
//order
async function createOrder(OrderPlace){
    var order_details;
    await OrderPlace.save().then((user)=>{
        console.log("Order Create successfully");
        order_details=user;
        return order_details;
    }).catch((err)=>{
        console.log("Error while  Creating order")  
        throw new Error(err);
        return null;
    }); 
    return order_details;
}

module.exports={
    createSeller,
    readSellerByEmail,
    readSellerById,
    readAllSellers,
    UpdateSeller,
    ChangeSellerStatus,
    readAdminByEmail,
    readAdminById,
    readDriverByEmail,
    readDriverById,
    createDriver,
    readAllDrivers,
    createOrder
}