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
    await Seller.findOne(data,function(err,result){     
        if (err) {
            throw "Database error";
        } else {
            console.log(result);  
            user=result; 
        }
        }).catch((e)=>{
          console.log(e);
          return null;          
        }); 
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

//read order by id
async function readOrderById(orderid){ 
    var order=null; 
    var data ={
        orderid:orderid
    };
    try{
       await Order.findOne(data,function(err,result){
         console.log(result);  
        if(!err){
            order=result; 
        } 
        });

    }catch(err){
        log.dbLog('readOrder:' + id, err);
    } 
    return order;
}
//all orders
async function readAllOrders(){
    var orders;
    await Order.find({},function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all drivers");
            orders =result.map((odr) => odr.orderid);; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return orders;
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
async function UpdateSeller(user,name,phone,address,city,state,order){
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
          if(order){
              console.log("order working");
              user.orders.push(order);
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

 
//admin restricted APIs for seller
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

//admin restricted APIs for driver
async function ChangDriverStatus(driver){
    var db_user;
    await driver.save().then((user)=>{
        console.log("Driver status changed successfully");
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
async function createOrder(OrderPlace,user){
    var order_details; 
    console.log(OrderPlace);
    await OrderPlace.save().then((ordr)=>{
        console.log("Order Create successfully");
        UpdateSeller(user,null,null,null,null,null,ordr.orderid).then((res)=>{
        order_details=ordr;
        }).catch((err)=>{
            console.log("error while saving the order to seller db");
        return null;         
        });
        order_details=ordr;
        return order_details;
    }).catch((err)=>{
        console.log("Error while  Creating order")  
        throw new Error(err);
        return null;
    }); 
    return order_details;
}

module.exports={
    //seller modules
    createSeller,
    readSellerByEmail,
    readSellerById,
    readAllSellers,
    UpdateSeller,
    ChangeSellerStatus, 
    //admin modules 
    readAdminByEmail,
    readAdminById,
    //driver modules
    readDriverByEmail,
    readDriverById,
    createDriver,
    readAllDrivers,
    ChangDriverStatus,
    //order modules
    createOrder,
    readOrderById,
    readAllOrders
}