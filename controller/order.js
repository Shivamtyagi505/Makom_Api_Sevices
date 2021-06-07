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
                currentlocation: req.body.currentlocation,
                pickofflocation:req.body.pickofflocation,
                destinationlocation:req.body.destinationlocation,
            }); 
            database.createOrder(OrderPlace).then((val) => {
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
   



 


