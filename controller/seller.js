"use strict";

const { nanoid } = require('nanoid');
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');
const jwt = require('jsonwebtoken');
const Seller = require('../model/sellerModal');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')
const OrderController =  require('../controller/order');



//seller sign up
exports.Signup = function (req, res, next) {
    //encrypting the plain password 
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let id = nanoid(IDSIZE);
            let uuid = mongoose.Types.ObjectId(id);
             let seller = new Seller({
                uuid:uuid, 
                email:req.body.email,
                name:req.body.name,
                category:req.body.category,
                phone:req.body.phone,
                address:req.body.address,
                password:hash,
                city:req.body.city,
                state: req.body.state,
                isverified:false,
                isblocked:false,
            }); 
            database.saveUser(seller).then((val) => {
                if (val == null) {
                    throw Error("Error while setting account");
                } else {
                    res.status(201).json({
                        message: "seller account successfully created."
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(401).json({
                    error: DBERROR
                });
            });
        }
    ).catch((err) => {
        console.log(err);
        return res.status(401).json({
            error: "Bad Request"
        });
    });
}

exports.Signin = async function (req, res, next) {
    var dbuser = null;
    const email = req.body.email
    try {
        //finding the seller in database from the email provided.
        await database.readUserByEmail(email,"seller").then((val) => {
            dbuser = val;
        }).catch((e) => {
            console.log("Error while getting user from email");
            return res.status(401).json({
                error: DBERROR
            });
        });

        if (dbuser != null) {
            //if user exists with the current email than comparing the hash with the password field.
            await bcrypt.compare(req.body.password, dbuser.password, function (err, result) {
                if (result) {  
                    let data = {
                        id:dbuser.uuid};
                    let auth_data={
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
                        };
                    //generating and sending the auth token as it will be required for furthur requests.
                    let authToken = jwt.sign(data, AUTHSECRET, { expiresIn: TOKENEXPIRE });
                    dbuser.fcm_token=req.body.fcm_token;
                    dbuser.save().then((result)=>{ 
                    return res.status(200).json({
                        message: "Successfully logged in",
                        details: authToken, 
                        user:auth_data
                    });
                    });
                } else {
                    return res.status(401).json({
                        error: "Invalid credentials"
                    });
                }
            });
        } else {
            throw "no user found";
        }
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            error: "Bad Request"
        });
    }
};

//get selller or particular seller by id;
exports.GetSeller = async function(req,res,next){
    var ids = req.body.ids;
    var allsellers=[];
        database.readUserByIds(ids,"seller").then((result)=>{
            allsellers = result.map(dbuser=>{
                return {
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
                }
            })
            return res.status(200).json({
                sellers: allsellers
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
     
}


exports.GetProfile = async function(req,res,next){
    var user = req.user;

    var user_data={
        uuid:user.uuid,
        name:user.name,
        email:user.email??"",
        phone:user.phone??"",
        address:user.address??"",
        city:user.city??"",
        state:user.state??"",
        orders:user.orders,
        products:user.products,
    }
    return res.status(200).json({
       user:user_data
    });
}

exports.UpdateProfile = async function(req,res,next){
    var user = req.user;
    const { name, phone, address, city,state} = req.body;
    if(name){
        user.name=name;
    } 
    if(phone){
        user.phone=phone;
    }
    if(address){
        user.address=address;
    }
    if(city){
        user.city=city;
    }
    if(state){
        user.state=state;
    }
    
    database.saveUser(user).then(user => {
        if (user) {
            var user_data={
                uuid:user.uuid,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                city:user.city,
                state:user.state};
          res.json({
            status: 0,
            user: user_data,
          });
          
        } else {
          res.json({
            status: 1,
            error: 'error - check lang, sports'
          });
        }
      }).catch(err => {
        log.errLog(err);
        res.json({
          status: 5,
          error: DBERROR,
        });
      });
}


exports.GetMyOrders = async function(req,res,next){
    var order_ids= req.user.order;
    req.body.ids=order_ids; 
    next();
}