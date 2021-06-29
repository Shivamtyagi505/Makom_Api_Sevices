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
const Activity = require('../model/loginActivity');

//admin signin
exports.Signin = async function (req, res, next) {
    var dbuser = null;
    const email = req.body.email 
    try {
        //finding the admin in database from the email provided.
        await database.readUserByEmail(email,"admin").then((val) => {
            dbuser = val;
        }).catch((e) => {
            return res.status(401).json({
                error: DBERROR
            });
        });
        if (dbuser != null) {
            //if admin exists with the current email than comparing the hash with the password field.
             bcrypt.compare(req.body.password, dbuser.password, function (err, result) {
                if (result) {  
                    let data = {
                        id:dbuser.uuid
                    };
                    //generating and sending the auth token as it will be required for furthur requests.
                    let authToken = jwt.sign(data, ADMINSECRET, { expiresIn: TOKENEXPIRE });
                    dbuser.fcm_token=req.body.fcm_token;
                    let admin_activity=new Activity({
                        device:req.headers['user-agent'],
                        ipaddress:req.ip ||null,
                        userid:dbuser.uuid || null,
                        email:req.body.email
                      })
                    database.saveActivity(admin_activity)
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
            database.saveUser(admin).then((val) => {
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

exports.ActivateSeller = async function(req,res,next){
    let id = req.body.id;
    let isverified=req.body.isverified;
    if(id!=null&&isverified!=null){
       await database.readUserByIds([id],"seller").then((val)=>{
        if(val==null||val[0]==null){
            return res.status(401).json({ 
                message:"Invalid seller id or seller does not exist",
        });
        }else{
            val[0].isverified=isverified;
            val[0].save().then((result)=>{ 
                mailservices.SendMail(val[0].email,"Account verified","Dear user your account is successfully verified").then((result)=>{ 
                    res.status(200).json({
                        isverified:isverified,
                        message:"seller account activated successfully"
                    }); 
                }).catch((e)=>{
                    console.log(e);
                    res.status(401).json({
                        error:"Error with email services"
                    });
                });      
            
            }).catch((e)=>{
                throw "Error while updating the seller status check for proper isverified flag in input";
            });
        }
       }).catch((err)=>{
        return res.status(401).json({
            error:err
        });    
       });
        
    }else{
        return res.status(401).json({
            error:"isverified or id not provided"
        });
    }
}
exports.LoginActivities = async function(req,res,next){
    database.readActivities().then((val)=>{
        return res.status(200).json({ 
            activities:val,
        });      
    }).catch((err)=>{
        return res.status(401).json({ 
            message:"No login activities available",
        });      
    })
}

exports.UpdateProfile = async function(req,res,next){
    var type = req.body.type;
    //selller,driver
    var id = req.body.id;
    const { name, phone, address, city,state,location,payment_threshold} = req.body;
    await database.readUserByIds([id],type).then((users)=>{
        if(users==null||users.Length==0){
            return res.status(401).json({
                error: 'No user with the current parameter found'
              });      
        }
        let user = users[0];
        if(name){
            user.name=name;
        }
        if(payment_threshold){
            user.payment_threshold=payment_threshold;
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
        if(location){
            user.location=location;
        }
    return  user.save().then((result)=>{
        if(result!=null){
            return res.status(200).json({
                error: 'User data updated successfully'
              });      
        }else{
            return res.status(401).json({
                error: 'Unable to update the userdata try again'
              });
        }
    }).catch((err)=>{
        return res.status(401).json({
            error: 'Provide valid update data error while updating the data'
          });      
    });  
 
}).catch((err)=>{
    return res.status(401).json({
        error: 'No user exist with current type and id provided'
      });      
    });
}

var account_deactivated="account is no longer active it has been blocked by the admin you will no longer be able to use makom services.";
var account_activated = "account is active now you will be able to use all makom services from now."
  
// update seller status by id;
exports.ChangeSellerStatus = async function(req,res,next){
    let id = req.body.id;
    let threshold = req.body.payment_threshold;
  await database.readUserByIds([id],"seller").then((val)=>{
         
        if(val==null||val[0]==null){
            return res.status(401).json({ 
                message:"Invalid driver id",
        });
        }
        var user_data=val[0];
        user_data.isblocked=req.body.isblocked;
        user_data.payment_threshold=threshold;
        var body = user_data.isblocked?account_deactivated:account_activated;
         console.log(user_data)
       database.saveUser(user_data).then((result)=>{ 
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
    let threshold = req.body.payment_threshold;
     await  database.readUserByIds([id],"driver").then((val)=>{
            if(val==null||val[0]==null){
                return res.status(401).json({ 
                    message:"Invalid driver id",
            });
            }
            var user_data=val[0];
            user_data.isblocked=req.body.isblocked; 
            user_data.payment_threshold=threshold;
            var body = user_data.isblocked?account_deactivated:account_activated;
 
            database.saveUser(user_data).then((result)=>{ 
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
 
// update driver status by id;
exports.SearchDriver = async function(req,res,next){
    const filters = req.query;
    const filteredUsers = [];
  await  database.readUserByIds(null,"driver").then((data)=>{
      print(data);
       filteredUsers = data.filter(user => {
            let isValid = true;
            for (key in filters) { 
              isValid = isValid && user[key] == filters[key];
            }
            return isValid;
          });
          res.status(200).json({filteredUsers});
    }).catch((err)=>{
        console.log("Error");
        res.status(401).json({
            "error":"Error while reading the data from database"
        });
    })
 
}
