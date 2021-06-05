const jwt = require('jsonwebtoken');
const database = require('../services/mongodb');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')

exports.requireAuth = async function (req, res, next) {
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
        console.log("user from jwt " + result.id);
         database.readSellerById(result.id).then((userdata)=>{
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