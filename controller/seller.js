"use strict";

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');


//seller sign up
exports.Signup = function (req, res, next) {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let id = nanoid(IDSIZE);
            database.createSeller(req.body.email, hash,id).then((val) => {
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
        return res.status(401).json({
            error: "Bad Request"
        });
    });
}
exports.Signin = async function (req, res, next) {
    var dbuser = null;
    try {
        await database.readSeller(req.body.email).then((val) => {
            dbuser = val;
        }).catch((e) => {
            return res.status(401).json({
                error: DBERROR
            });
        });

        if (dbuser != null) {
            await bcrypt.compare(req.body.password, dbuser.password, function (err, result) {
                if (result) {
                   return res.status(200).json({
                        message: "Successfully logged in"
                    });
                } else {
                  return  res.status(401).json({
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