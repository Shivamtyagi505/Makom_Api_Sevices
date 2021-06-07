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
    try {
        //finding the admin in database from the email provided.
        await database.readAdminByEmail(req.body.email).then((val) => {
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
                    return res.status(200).json({
                        message: "Successfully logged in",
                        details: authToken, 
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

//**** admin other domains ****//

//get drivers or particular driver by id;
exports.GetDriver = async function(req,res,next){
    let id = req.query.id;
    var alldrivers=[];
    if(id!=null){
        database.readDriverById(id).then((val)=>{
            var user_data={
                uuid:val.uuid,
                name:val.name,
                email:val.email??"",
                phone:val.phone??"",
                address:val.address??"",
                city:val.city??"",
                state:val.state??"",
            }
            return res.status(200).json({
                driver: user_data
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
    }else{
        database.readAllDrivers().then((val)=>{
            return res.status(200).json({
                drivers: val
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
    }
}

//get seller or particular seller by id;
exports.GetSeller = async function(req,res,next){
    let id = req.query.id;
    var allsellers=[];
    if(id!=null){
        database.readSellerById(id).then((val)=>{
            var user_data={
                uuid:val.uuid,
                name:val.name,
                email:val.email??"",
                phone:val.phone??"",
                address:val.address??"",
                city:val.city??"",
                state:val.state??"",
            }
            return res.status(200).json({
                seller: user_data
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
    }else{
        database.readAllSellers().then((val)=>{
            return res.status(200).json({
                sellers: val
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
    }
}
// update seller status by id;
exports.ChangeSellerStatus = async function(req,res,next){
    let id = req.query.id;
        database.readSellerById(id).then((val)=>{
            var user_data=val;
            user_data.isblocked=req.body.isblocked;
            
            database.ChangeSellerStatus(user_data).then((result)=>{ 
                return res.status(200).json({
                    result:"Status chaged successfully"
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




 


