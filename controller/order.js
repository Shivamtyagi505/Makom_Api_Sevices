"use strict";

const { nanoid } = require('nanoid');
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');
const jwt = require('jsonwebtoken');
const Order = require('../model/orderModal')
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')



//create a order
exports.CreateOrder = async function (req, res, next) {
            let id = nanoid(IDSIZE);
            let uuid = mongoose.Types.ObjectId(id);
             let OrderPlace = new Order({
                orderid:uuid, 
                receiver:req.body.receiver, 
                seller:{
                    uuid:req.user.uuid,
                    name:req.user.name,
                    phone:req.user.phone,
                    email:req.user.email
                }, 
                payment:req.body.payment, 
                products:req.body.products,
                status: "Placed",  
                pickofflocation:req.body.pickofflocation,
                destinationlocation:req.body.destinationlocation,
            });  
           await database.createOrder(OrderPlace,req.user).then((val) => {
                if (val == null) {
                    throw Error("Error while creating order");
                } else {
                    res.status(201).json({
                        message: "Order successfully created.",
                        order:val
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(401).json({
                    error: DBERROR
                });
            });
        }
   
//get order or particular order by id;
 //get drivers or particular driver by id;
exports.GetOrder = async function(req,res,next){
    var ids = req.body.ids;
    var allorders=[];
    if(ids!=null){
        database.readOrderByIds(ids).then((result)=>{
            allorders = result;
            return res.status(200).json({
                orders: allorders
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
    }else{
        database.readAllOrders().then((val)=>{
            return res.status(200).json({
                orders: val
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
    }
}

//verify order to driver
exports.VerifyOrder = async function(req,res,next){
    let driverid = req.body.driverid;
    let orderid=req.body.orderid;
    let action= req.body.action;
 
    if(orderid&&action&&action=="approved"||action=="rejected"){
        database.readOrderById(orderid).then((order)=>{
            if(action=="rejected"){
                order.status="rejected";
                order.save().then((result)=>{ 
                    res.status(200).json({
                        order:result    
                    });
                }).catch((err)=>{
                    res.status(401).json({
                        error:"Error while updating the order"    
                    }); 
                });
                //update the order status to approved and assign it to the driver

            }else if(action=="approved"&&driverid){
                database.readDriverById(driverid).then((driver)=>{
                    let update_driver=driver;
                    order.status="approved";
                    order.save().then((result)=>{
                       order=result;
                    }).catch((err)=>{
                        throw "Error while approving the order"
                    });
                    update_driver.orders.push(orderid);
                    update_driver.save().then((drvr)=>{
                        update_driver=drvr;
                    }); 
                    res.status(200).json({
                        status:"Order has been successfully approved",
                        order:order 
                    });
                    }).catch((e)=>{
                        console.log(e);
                        throw "Unable to find the driver by id"
                    });

            }else {
                res.status(401).json({
                    status:"Missing driverid"
                });
               
            } 
        }).catch((e)=>{
            console.log(e);
            throw "No order found";
        });
    } else{
        return res.status(401).json({
            error: "Provide admin 'action' either approved or rejected"
        });
    }

  
}


 

 


