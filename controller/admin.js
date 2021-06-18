"use strict";

const { nanoid } = require('nanoid');
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');
const jwt = require('jsonwebtoken');
const Admin = require('../model/adminModal');
const Driver = require('../model/driverModal');
const Seller = require('../model/sellerModal');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')

//admin signin
exports.Signin = async function (req, res, next) {
    var dbuser = null;
    const email = req.body.email 
    try {
        //finding the admin in database from the email provided.
        await database.readAdminByEmail(email).then((val) => {
            dbuser = val;
        }).catch((e) => {
            return res.status(401).json({
                error: DBERROR
            });
        });
        if (dbuser != null) {
            //if admin exists with the current email than comparing the hash with the password field.
            await bcrypt.compare(req.body.password, dbuser.password, function (err, result) {
                if (result) {  
                    let data = {
                        id:dbuser.uuid
                    };
                    //generating and sending the auth token as it will be required for furthur requests.
                    let authToken = jwt.sign(data, ADMINSECRET, { expiresIn: TOKENEXPIRE });
                    dbuser.fcm_token=req.body.fcm_token;
                    dbuser.save().then((result)=>{
                        return res.status(200).json({
                            message: "Successfully logged in",
                            details: authToken,
                            email : email,
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
//create a new admin
exports.NewAdmin = function (req, res, next) {
    //encrypting the plain password 
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let id = nanoid(IDSIZE);
            let uuid = mongoose.Types.ObjectId(id);
             let admin = new Admin({
                uuid:uuid, 
                email:req.body.email,
                name:req.body.name, 
                password:hash,
            }); 
            database.createAdmin(admin).then((val) => {
                if (val == null) {
                    throw Error("Error while setting account");
                } else {
                    res.status(201).json({
                        message: "admin account successfully created."
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



  
// update seller status by id;
exports.ChangeSellerStatus = async function(req,res,next){
    let id = req.query.id;
        database.readSellerByIds(id).then((val)=>{
            var user_data=val;
            user_data.isblocked=req.body.isblocked;
           // console.log(user_data)
            database.ChangeSellerStatus(user_data).then((result)=>{ 
                return res.status(200).json({
                    message:"Seller Status changed successfully"
            });
            }).catch((e)=>{
                throw "Error while changing status";
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });  
}

// update driver status by id;
exports.ChangeDriverStatus = async function(req,res,next){
    let id = req.query.id;
        database.readDriverByIds(id).then((val)=>{
            var user_data=val;
            user_data.isblocked=req.body.isblocked;
           //  console.log(user_data)
            database.ChangeDriverStatus(user_data).then((result)=>{ 
                return res.status(200).json({
                    user_data:user_data.isblocked,
                    message:"Driver Status changed successfully",
            });
            }).catch((e)=>{
                throw "Error while changing status";
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });  
}


 


