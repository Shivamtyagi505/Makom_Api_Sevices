"use strict";

const { nanoid } = require('nanoid');
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');
const jwt = require('jsonwebtoken');
const Driver = require('../model/driverModal');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')
const mailservices = require('../controller/email')


//driver  sign up only under admin control no independent signup
exports.Signup = function (req, res, next) {
    //encrypting the plain password 
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let id = nanoid(IDSIZE);
            let uuid = mongoose.Types.ObjectId(id);
             let driver = new Driver({
                uuid:uuid, 
                email:req.body.email,
                name:req.body.name,
                phone:req.body.phone,
                address:req.body.address,
                password:hash,
                city:req.body.city,
                state: req.body.state,
                isblocked:false, 
            }); 
            database.saveUser(driver).then((val) => {
                if (val == null) {
                    throw Error("Error while setting account");
                } else {
                    res.status(201).json({
                        message: "driver account successfully created."
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
    var email = req.body.email
    try {
        console.log("Reading the driver from database");
        //finding the driver in database from the email provided.
        await database.readUserByEmail(email,"driver").then((val) => {
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
                        id:dbuser.uuid, 
                    };
                    let auth_res={
                        id:dbuser.uuid, 
                        name:dbuser.name,
                        email:dbuser.email??"",
                        phone:dbuser.phone??"",
                        address:dbuser.address??"",
                        city:dbuser.city??"",
                        state:dbuser.state??"",
                        orders:dbuser.orders,
                        isblocked:dbuser.isblocked,
                     }
                    //generating and sending the auth token as it will be required for furthur requests.
                    let authToken = jwt.sign(data, AUTHSECRET, { expiresIn: TOKENEXPIRE });
                    dbuser.fcm_token=req.body.fcm_token;
                    dbuser.save().then((result)=>{
                        return res.status(200).json({
                            message: "Successfully logged in",
                            details: authToken, 
                            user:auth_res
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
        return res.status(401).json({
            error: "Bad Request"
        });
    }
};

//get selller or particular driver by name;
exports.GetDriverByName = async function(req,res,next){
    var name = req.body.name;
    var alldrivers=[];
     await  Driver.find({"name": name}).then((result)=>{
            alldrivers = result.map(dbuser=>{
                return {
                    uuid:val.uuid,
                    name:val.name,
                    email:val.email??"",
                    phone:val.phone??"",
                    address:val.address??"",
                    city:val.city??"",
                    state:val.state??""
                }
            })
            return res.status(200).json({
                drivers: alldrivers
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
     
}
//get drivers or particular driver by id;
exports.GetDriver = async function(req,res,next){
    var ids = req.body.ids;
    var alldrivers=[];
     await database.readUserByIds(ids,"driver").then((result)=>{
            alldrivers = result.map(val=>{
                return {
                    uuid:val.uuid,
                    name:val.name,
                    email:val.email??"",
                    phone:val.phone??"",
                    address:val.address??"",
                    city:val.city??"",
                    state:val.state??"",
                }
            })
            return res.status(200).json({
                drivers: alldrivers
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
    }
    return res.status(200).json({
       user:user_data
    });
}
exports.GetOrders = async function(req,res,next){
    var ids = req.user.orders;
  await database.readObjectsByIds(ids,"order").then((result)=>{
        return res.status(200).json({
            orders: result
        });
    }).catch((e)=>{
        console.log(e);
        return res.status(401).json({
            error: "Bad Request"
        });
    });
}
exports.UpdateStatus = async function(req,res,next){
    var id = req.body.id;
    var status = req.body.status;
  await database.readObjectsByIds([id],"order").then((result)=>{
        let order=  result[0];
        order.status = status;
        order.save().then((resp)=>{ 
        return res.status(200).json({
            message:"Status updated",
            order:resp
        });
        }).catch((err)=>{
            console.log(e);
            return res.status(401).json({
                error: "Request Failed"
            });    
        })
    }).catch((e)=>{
        console.log(e);
        return res.status(401).json({
            error: "Bad Request"
        });
    });
}
//driver accept or decline the order
exports.UpdateLocation = async function(req,res,next){
    let id= req.body.id;
    let location = req.body.currentlocation
  await database.readObjectsByIds([id],"order").then((result)=>{
        let order=  result[0];
        order.currentLocation = location;
        order.save().then((resp)=>{ 
        return res.status(200).json({
            message:"Location updated",
            order:resp
        });
        }).catch((err)=>{
            console.log(e);
            return res.status(401).json({
                error: "Request Failed"
            });    
        })
    }).catch((e)=>{
        console.log(e);
        return res.status(401).json({
            error: "Bad Request"
        });
    });
    
}

exports.OrderVerify = async function(req,res,next){
    var user = req.user;  
    let orderid=req.body.orderid;
    let action= req.body.action;
    console.log(action);

 
    if(orderid&&action&&action=="accepted"||action=="rejected"){
       await database.readObjectsByIds([orderid],"order").then((orders)=>{
            if(!orders){
                res.status(401).json({
                    error:"Unable to find your order"
                })
            }
            if(action=="rejected"){
                user.orders.pop(orderid);
                user.save().then((result)=>{
                    res.status(200).json({
                        status:"Request successfully placed",    
                     });
                }).catch((err)=>{

                    res.status(401).json({
                        error:"Service not available"    
                    });
                })
            }else if(action=="accepted"&&orderid){ 
                     var order = orders[0];   
                    order.status="assigned";

                    order.assignedto={
                        uuid:user.uuid,
                        name:user.name,
                        email:user.email,
                        phone:user.phone,
                    };
                    order.save().then((result)=>{
                       order=result;
                    }).catch((err)=>{
                        throw "Error while approving the order"
                    }); 
                    var body = "Order has been successfully assigned to "+user.name+"\nphone numer : "+user.phone+"\n Email address :"+user.email;
                    
                    mailservices.SendMail(order.seller.email,"Order Update","Dear user your "+body).then((result)=>{ 
                        res.status(200).json({
                            status:"Order has been successfully assigned",
                            order:order 
                        }); 
                    }).catch((e)=>{
                        console.log(e);
                        res.status(401).json({
                            error:"Error with email services"
                        });
                    });  
            }else {
                res.status(401).json({
                    status:"Missing order id or imporper action"
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

