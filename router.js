const express = require('express');

const testController = require('./controller/test');
const sellerAuthController = require('./controller/seller');



module.exports= function(app){
    //initialising api routes
    const apiRoutes = express.Router();

    //test APIs
    apiRoutes.get('/test/hello',testController.getRequest);
    apiRoutes.post('/test/helo',testController.postRequest);

    //seller authentication
    apiRoutes.post('/seller/signup',sellerAuthController.Signup);
    apiRoutes.post('/seller/signin',sellerAuthController.Signin);
    
    
    //set url for API v1 group routes
    app.use('/v1/api',apiRoutes);

}