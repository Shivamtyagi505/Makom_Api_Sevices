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
                receivername:req.body.receivername,
                receiverphone:req.body.receiverphone,
                sellerid:req.user.uuid, 
                payment:req.body.payment, 
                status:req.body.status, 
                currentlocation: req.body.currentlocation,
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
exports.GetOrder = async function(req,res,next){
    let id = req.query.id;
    var allorders=[];
    if(id!=null){
        database.readOrderById(id).then((val)=>{
            return res.status(200).json({
                orders: val
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

//assign order to driver
exports.AssignOrder = async function(req,res,next){
    let driverid = req.body.driverid;
    let orderid=req.body.orderid;
    if(driverid&&orderid){
        database.readOrderById(orderid).then((order)=>{
            if(order!=null){
            database.readDriverById(driverid).then((driver)=>{
            let update_driver=driver;
            update_driver.orders.push(orderid);
            update_driver.save();
            console.log("order provided to the driver");
            }).catch((e)=>{
                console.log(e);
                throw "Unable to find the driver by id"
            });         
            } 
        }).catch((e)=>{
            console.log(e);
            throw "No order found";
        });
    } else{
        return res.status(401).json({
            error: "Provide a order id and driver id"
        });
    }

  
}


 

 


