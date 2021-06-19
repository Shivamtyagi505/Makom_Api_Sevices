const mongoose = require('mongoose');

//MODELS
const Seller = require('../model/sellerModal');
const Admin = require('../model/adminModal');
const Driver = require('../model/driverModal');
const Order = require('../model/orderModal');
const Product = require('../model/productModal');

//UTILS
const log = require('../util/logger')


/***Read Queries***/

async function readUserByIds(ids,type){

    console.log("Fetching query of "+type);
    var user=[]; 
    var data;
    if(ids){
        data ={
            uuid:ids
        }; 
    }else{
        data={}
    }
    var queryModel;

    if(type=="admin")
        queryModel=Admin
    else if(type=="seller")
        queryModel = Seller
    else if (type=="driver")
        queryModel = Driver
    else 
        return null;     

    await queryModel.find(data,function(err,result){     
        if (err) {
            throw "Database error";
        } else { 
             user=result;
        }
        }).catch((e)=>{
          console.log(e);
          return null;          
        });   
    return user;
}


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
 

//admin by email
async function readAdminByEmail(email){ 
    var user=null;
    var data ={
        email:email
    };
    await Admin.findOne(data,function(err,result){     
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

 

//driver by email
async function readDriverByEmail(email){ 
    var user=null;
    var data ={
        email:email
    };
    await Driver.findOne(data,function(err,result){     
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
 
async function readObjectsByIds(ids,type){ 
    var objects=[]; 
    var QueryModel;
    var data={};
    if(type=="order"){
        QueryModel=Order;
        if(ids!=null){
            data={
                orderid:ids
            }
        } 
    }
    else if (type=="product"){
        QueryModel = Product;
        var data ={
            product_id:ids
        };
    }else{
        return null;
    }
    
    await QueryModel.find(data,function(err,result){     
        if (err) {
            throw "Database error";
        } else {
             objects=result;
        }
        }).catch((e)=>{
          console.log(e);
          return null;          
        });   
    return objects;
}

 
/***Write Queries ***/
//admin
async function createAdmin(admin){
    var db_user;
    await admin.save().then((user)=>{
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
async function UpdateSeller(user,name,phone,address,city,state,order,product_id){
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
          if(product_id){ 
              user.products.push(product_id);
          }
          if(order){ 
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
        console.log(seller)
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
async function ChangeDriverStatus(driver){
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

//products 

async function createProduct(product,user){
    var product_details;  
    await product.save().then((prdct)=>{
        console.log("product Create successfully");
        UpdateSeller(user,null,null,null,null,null,null,prdct.product_id).then((res)=>{
        product_details=prdct;
        }).catch((err)=>{
            console.log("error while saving the product to seller db");
        return null;         
        }); 
        product_details=prdct;
        return product_details;
    }).catch((err)=>{
        console.log("Error while  Creating product")  
        throw new Error(err);
        return null;
    }); 
    return product_details;
}
 

module.exports={
    readUserByIds,
    //seller modules
    createSeller,
    readSellerByEmail, 
    UpdateSeller,
    ChangeSellerStatus, 
    //admin modules 
    readAdminByEmail, 
    createAdmin,
    //driver modules
    readDriverByEmail,
    createDriver, 
    ChangeDriverStatus,
    readObjectsByIds,
    //order modules
    createOrder, 
    //product 
    createProduct, 
}