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



//seller sign up
exports.order = function (req, res, next) {
            let id = nanoid(IDSIZE);
             let OrderPlace = new Order({
                orderid:req.body.orderid,
                driverid:req.body.driverid,
                receivername:req.body.receivername,
                sellerid:req.body.sellerid,
                phone:req.body.phone,
                payment:req.body.payment,
                currentlocation: req.body.currentlocation,
                pickofflocation:req.body.pickofflocation,
                destinationlocation:req.body.destinationlocation,
            }); 
            database.createOrder(OrderPlace).then((val) => {
                if (val == null) {
                    throw Error("Error while setting account");
                } else {
                    res.status(201).json({
                        message: "Order successfully created."
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(401).json({
                    error: DBERROR
                });
            });
        }
   



 


