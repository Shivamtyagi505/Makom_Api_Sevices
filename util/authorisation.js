const jwt = require('jsonwebtoken');
const database = require('../services/mongodb');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')
const request_type = require('../util/request_type')

exports.AuthManager = function (req, res, next) {

    var type = request_type.GetRequestType(req.url);
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
    var SECRET = type == "admin" ? ADMINSECRET : AUTHSECRET;
    jwt.verify(token, SECRET, async (err, result) => {
        if (err) return res.status(401).json({
            error: "Unauthorized",
            message: err.message,
        });

        //fetching the user from database for further use 
        await database.readUserByIds(result.id, type).then((userdata) => {
            req.user = userdata[0];
            console.log("Requesting Data for " + req.user.email + " Type " + type);
            next();
        }).catch((err) => {
            console.log(err);
            res.status(401).json({
                error: "Issue while reading the user from database"
            });
        });
    }).catch((err) => {
        console.log(err);
        res.status(401).json({
            error: "Token signature does not match"
        });
    });


}

