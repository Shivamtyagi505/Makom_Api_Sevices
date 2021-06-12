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
                phone:req.body.phone,
                address:req.body.address,
                password:hash,
                city:req.body.city,
                state: req.body.state,
                isverified:false,
                isblocked:false,
            }); 
            database.createSeller(seller).then((val) => {
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
    try {
        //finding the seller in database from the email provided.
        await database.readSellerByEmail(req.body.email).then((val) => {
            dbuser = val;
        }).catch((e) => {
            return res.status(401).json({
                error: DBERROR
            });
        });

        if (dbuser != null) {
            //if user exists with the current email than comparing the hash with the password field.
            await bcrypt.compare(req.body.password, dbuser.password, function (err, result) {
                if (result) {  
                    let data = {
                        uuid:dbuser.uuid};
                    let auth_data={
                        uuid:dbuser.uuid,
                        name:dbuser.name,
                        email:dbuser.email,
                        phone:dbuser.phoneNumber,
                        address:dbuser.address,
                        city:dbuser.city,
                        state:dbuser.state,
                        order:dbuser.order,
                        isblocked:dbuser.isblocked,
                        isverified:dbuser.isverified,
                        };
                    //generating and sending the auth token as it will be required for furthur requests.
                    let authToken = jwt.sign(data, AUTHSECRET, { expiresIn: TOKENEXPIRE });
                    return res.status(200).json({
                        message: "Successfully logged in",
                        details: authToken, 
                        user:auth_data
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
exports.GetProfile = async function(req,res,next){
    var user = req.user;
    var user_data={
        uuid:user.uuid,
        name:user.name,
        email:user.email??"",
        phone:user.phoneNumber??"",
        address:user.address??"",
        city:user.city??"",
        state:user.state??"",
    }
    return res.status(200).json({
       user:user_data
    });
}

exports.UpdateProfile = async function(req,res,next){
    var user = req.user;
    const { name, phone, address, city,state} = req.body;
 
    database.UpdateSeller(user,name,phone,address,city,state).then(user => {
        if (user) {
            var user_data={
                uuid:user.uuid,
                name:user.name,
                email:user.email,
                phone:user.phoneNumber,
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