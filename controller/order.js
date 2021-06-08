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

 

 


