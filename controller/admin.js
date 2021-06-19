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
const mailservices = require('../controller/email')

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
                            email : result.email,
                            name:result.name,
                            uuid:result.uuid
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


var account_deactivated="account is no longer active it has been blocked by the admin you will no longer be able to use makom services.";
var account_activated = "account is active now you will be able to use all makom services from now."
  
// update seller status by id;
exports.ChangeSellerStatus = async function(req,res,next){
    let id = req.body.id;
    database.readUserByIds([id],"seller").then((val)=>{
         
        if(val==null||val[0]==null){
            return res.status(401).json({ 
                message:"Invalid driver id",
        });
        }
        var user_data=val[0];
        user_data.isblocked=req.body.isblocked;
        var body = user_data.isblocked?account_deactivated:account_activated;
         console.log(user_data)
        database.ChangeSellerStatus(user_data).then((result)=>{ 
            mailservices.SendMail(user_data.email,"Account status changed","Dear user your "+body).then((result)=>{ 
                res.status(200).json({
                    isblocked:user_data.isblocked,
                    message:"seller Status changed successfully"
                }); 
            }).catch((e)=>{
                console.log(e);
                res.status(401).json({
                    error:"Error with email services"
                });
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
    let id = req.body.id;
        database.readUserByIds([id],"driver").then((val)=>{
            if(val==null||val[0]==null){
                return res.status(401).json({ 
                    message:"Invalid driver id",
            });
            }
            var user_data=val[0];
            user_data.isblocked=req.body.isblocked;
            user_data.isblocked=req.body.isblocked;
            var body = user_data.isblocked?account_deactivated:account_activated;
 
            database.ChangeDriverStatus(user_data).then((result)=>{ 
                mailservices.SendMail(user_data.email,"Account status changed","Dear user your "+body).then((result)=>{ 
                    res.status(200).json({
                        isblocked:user_data.isblocked,
                        message:"Driver Status changed successfully"
                    }); 
                }).catch((e)=>{
                    console.log(e);
                    res.status(401).json({
                        error:"Error with email services"
                    });
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


 


