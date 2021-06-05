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
            database.createDriver(driver).then((val) => {
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
    try {
        //finding the driver in database from the email provided.
        await database.readDriverByEmail(req.body.email).then((val) => {
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
                        id:dbuser.uuid
                    };
                    //generating and sending the auth token as it will be required for furthur requests.
                    let authToken = jwt.sign(data, AUTHSECRET, { expiresIn: TOKENEXPIRE });
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
        phone:user.phone??"",
        address:user.address??"",
        city:user.city??"",
        state:user.state??"",
    }
    return res.status(200).json({
       user:user_data
    });
}

