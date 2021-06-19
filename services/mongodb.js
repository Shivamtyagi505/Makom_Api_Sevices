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
    var data ={
        uuid:ids
    };
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
            console.log("Got the result")
             user=result;
             
        }
        }).catch((e)=>{
          console.log(e);
          return null;          
        });   
    return user;
}

async function readUserByEmail(email,type){
    console.log("Fetching query of "+type);
    var user=null; 
    var data ={
        email:email
    };
    var queryModel;

    if(type=="admin")
        queryModel=Admin
    else if(type=="seller")
        queryModel = Seller
    else if (type=="driver")
        queryModel = Driver
    else 
        return null;     

    await queryModel.findOne(data,function(err,result){     
        if (err) {
            throw "Database error";
        } else {
            console.log("Got the result")
             user=result;
             console.log(user)
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
            console.log("getting all Sellers");
            sellers =result.map((dbuser) => {return {
                uuid:dbuser.uuid,
                name:dbuser.name,
                email:dbuser.email,
                phone:dbuser.phone,
                address:dbuser.address,
                category:dbuser.category,
                city:dbuser.city,
                state:dbuser.state,
                order:dbuser.orders,
                products:dbuser.products,
                isblocked:dbuser.isblocked,
                isverified:dbuser.isverified,
                activity : dbuser.activity,
            }});; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return sellers;
}

 
//all drivers
async function readAllDrivers(){
    var drivers;
    await Driver.find({},function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all drivers");
            drivers =result.map((val) => {
                return {
                uuid: val.uuid,
                name: val.name,
                email: val.email,
                phone: val.phone,
                address: val.address,
                city:val.city ,
                state:val.state,
                isblocked:val.isblocked,
                }
            });

        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return drivers;
}

//read order by ids
async function readOrderByIds(ids){ 
    var orders=[]; 
    var data ={
        orderid:ids
    };
    await Order.find(data,function(err,result){     
        if (err) {
            throw "Database error";
        } else {
             orders=result;
        }
        }).catch((e)=>{
          console.log(e);
          return null;          
        });   
    return orders;
}

 
//all orders
async function readAllOrders(){
    var orders;
    await Order.find({},function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all Orders");
            orders =result; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return orders;
}

//all Placed orders details
async function readAllPlacedOrders(status){
    var orders;
    var data = { 
        status: 'Placed'
    }
    await Order.find(data,function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all PLaced Orders");
            orders =result; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return orders;
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
async function getAllProducts(ids){
    var products=[];
    await Product.find({
        'product_id' :  ids
    },function(err,result){
        if (err) {
            throw "Database error";
        } else {
            console.log("getting all products");
             products=result; 
        }

    }).catch((e)=>{
        log.dbLog('readUser:' + id, err);    
    });
    return products;

}

module.exports={
    readUserByIds,
    readUserByEmail,
    //seller modules
    createSeller,
    readAllSellers,
    UpdateSeller,
    ChangeSellerStatus, 
    //admin modules 
    createAdmin,
    readAllPlacedOrders,
    //driver modules
    createDriver,
    readAllDrivers,
    ChangeDriverStatus,
    //order modules
    createOrder,
    readOrderByIds,
    readAllOrders,
    //product 
    createProduct,
    getAllProducts
}