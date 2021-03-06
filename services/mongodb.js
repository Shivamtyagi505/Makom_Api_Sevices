const mongoose = require('mongoose');

//MODELS
const Seller = require('../model/sellerModal');
const Admin = require('../model/adminModal');
const Driver = require('../model/driverModal');
const Order = require('../model/orderModal');
const Product = require('../model/productModal');

const LoginActivity = require('../model/loginActivity');

//UTILS
const log = require('../util/logger');
const { json } = require('express');


/*****************************Read Queries*************************************************/

async function readUserByIds(ids, type) {

    console.log("Fetching query of " + type);
    var data={};
    if (ids) {
        data = {
            uuid: ids
        };
    }  
    var queryModel;

    if (type == "admin")
        queryModel = Admin
    else if (type == "seller")
        queryModel = Seller
    else if (type == "driver")
        queryModel = Driver
    else
        return null;
    console.log("Fine upto here");
    return   await queryModel.find(data, function (err, result) {
    
        if (err) {
          return [];
        } else { 
            return result;
        }
    }).catch((e) => {
        console.log("This is the error while reading");
        console.log(e);
        return [];
    }); 
}

async function readUserByEmail(email, type) {
    console.log("Fetching query of " + type);
    var user = null;
    var data = {
        email: email
    };
    var queryModel;

    if (type == "admin")
        queryModel = Admin
    else if (type == "seller")
        queryModel = Seller
    else if (type == "driver")
        queryModel = Driver
    else
        return null;

   return await queryModel.findOne(data, function (err, result) {
        if (err) { 
            return [];
        } else {  
            return result;
        }
    }).catch((e) => {
        console.log(e);
        return [];
    }); 
}
async function readActivities(){
    return  await LoginActivity.find({}, function (err, result) {
        if (err) {
        return []; 
        } else { 
            return result;
        }
    }).catch((e) => { 
        return [];
    });  
}

async function readObjectsByIds(ids, type) {
    var objects = [];
    var QueryModel;
    var data = {};
    if (type == "order") {
        QueryModel = Order;
        if (ids != null) {
            data = {
                orderid: ids
            }
        }
    }
    else if (type == "product") {
        QueryModel = Product;
        var data = {
            product_id: ids
        };
    } else {
        return null;
    }

  
    // return await QueryModel.find(data).sort({date: -1}).exec(function(err,docs){ 
    //     if (err) {
    //         return []; 
    //         } else {  
    //             return docs;
    //         }
    // });
    return  await QueryModel.find(data, function (err, result) {
    if (err) {
        return []; 
        } else { 
            return result;
        }
    }).catch((e) => { 
        return [];
    }); 
}

async function readUsersByIdsandDelete(ids, type) {
    var objects = [];
    var QueryModel;
    var data = {};
    if (type == "seller") {
        QueryModel = Seller;
        if (ids != null) {
            data = {
                sellerid: ids
            }
        }
    }
    else if (type == "driver") {
        QueryModel = Driver;
        var data = {
            driver_id: ids
        };
    } else {
        return null;
    }

  return  await QueryModel.findByIdAndRemove(data, function (err, result) {
        if (err) {
        return []; 
        } else { 
            return result;
        }
    }).catch((e) => { 
        return [];
    }); 
}

/*****************************Write Queries*************************************************/

async function saveUser(user) {
    var db_user;
    await user.save().then((user) => {
        console.log("User saved successfully");
        db_user = user;
        return user;
    }).catch((err) => {
        console.log("Error while adding user to db")
        throw new Error(err);
        return null;
    });
    return db_user;
}

async function createOrder(OrderPlace, user) {
    var order_details;
    console.log(OrderPlace);
    await OrderPlace.save().then((ordr) => {
        console.log("Order Create successfully");
        user.orders.push(ordr.orderid);
        saveUser(user).then((res) => {
            order_details = ordr;
        }).catch((err) => {
            console.log("error while saving the order to seller db");
            return null;
        });
        order_details = ordr;
        return order_details;
    }).catch((err) => {
        console.log("Error while  Creating order")
        throw new Error(err);
        return null;
    });
    return order_details;
}


async function createProduct(product, user) {
    var product_details;
    await product.save().then((prdct) => {
        console.log("product Create successfully");
        user.products.push(prdct.product_id);
        saveUser(user).then((res) => {
            product_details = prdct;
        }).catch((err) => {
            console.log("error while saving the product to seller db");
            return null;
        });
        product_details = prdct;
        return product_details;
    }).catch((err) => {
        console.log("Error while  Creating product")
        throw new Error(err);
        return null;
    });
    return product_details;
}

async function saveActivity(
    Activity 
){
    
    return  await Activity.save().then((result)=>{
        return result
    }).catch((e)=>{
        console.log(e)
    })
}

  
module.exports = {
    //read query
    readUserByIds,
    readUserByEmail,
    readObjectsByIds,
    readActivities,
    readUsersByIdsandDelete,
    //write query
    saveUser,
    createOrder,
    createProduct,
    saveActivity, 
    
}