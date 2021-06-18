const jwt = require('jsonwebtoken');
const database = require('../services/mongodb');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')

exports.requireCommonAuth = async function(req,res,next){
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    });
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    }); 
    jwt.verify(token, AUTHSECRET, async (err, result) => {
        if (err) {
            jwt.verify(token, ADMINSECRET, async (err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: "Unauthorized",
                        message: err.message,
                    });
                } 
            });

        }
   });
   next();
}   

//seller
exports.requireSellerAuth = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    });
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    }); 
     jwt.verify(token, AUTHSECRET,async (err, result) => {
         if (err) return res.status(401).json({
            error: "Unauthorized",
            message: err.message,
        }); 

      await database.readSellerByIds(result.id).then((userdata)=>{
                req.user=userdata[0]; 
                next();
         }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:"Internal server error"
            });    
         });   

    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:"Internal server error"
        });    
    });
}
//seller
exports.requireDriverAuth = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    });
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    }); 
    await jwt.verify(token, AUTHSECRET, (err, result) => {
        if (err) return res.status(401).json({
            error: "Unauthorized",
            message: err.message,
        }); 
         database.readDriverByIds(result.id).then((userdata)=>{
                req.user=userdata[0];
                next();
         }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:"Internal server error"
            });    
         });   

    });
}
//seller
exports.requireAdminAuth = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    });
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    }); 
    await jwt.verify(token, ADMINSECRET, (err, result) => {
        if (err) return res.status(401).json({
            error: "Unauthorized",
            message: err.message,
        }); 
         database.readAdminById(result.id).then((userdata)=>{
                req.user=userdata; 
                next();
         }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:"Internal server error"
            });    
         });   

    });
}

//Admin accessible services
exports.requireAdminPermission = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    });
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({
        error: 'Forbidded',
        message: 'Token Not Found'
    }); 
    await jwt.verify(token, ADMINSECRET, (err, result) => {
        if (err) return res.status(401).json({
            error: "Unauthorized",
            message: err.message,
        }); 
         database.readAdminById(result.id).then((userdata)=>{
                next();
         }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:"Internal server error"
            });    
         });   

    });
}