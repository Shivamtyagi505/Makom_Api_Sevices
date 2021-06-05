const express = require('express');

const testController = require('./controller/test');
const sellerAuthController = require('./controller/seller');
const adminAuthController = require('./controller/admin');
const driverAuthController = require('./controller/driver');
const auth = require('./util/authorisation');


module.exports= function(app){
    //initialising api routes
    const apiRoutes = express.Router();

    //test APIs
    apiRoutes.get('/test/hello',testController.getRequest);
    apiRoutes.post('/test/helo',testController.postRequest);

    //seller APIs
    apiRoutes.post('/seller/signup',sellerAuthController.Signup);
    apiRoutes.post('/seller/signin',sellerAuthController.Signin);
    apiRoutes.get('/seller/profile',auth.requireSellerAuth,sellerAuthController.GetProfile);

    //admin APIs 
    apiRoutes.post('/admin/signin',adminAuthController.Signin);
    apiRoutes.post('/admin/newdriver',auth.requireAdminPermission,driverAuthController.Signup);

    //driver APIs
    apiRoutes.post('/driver/signin',driverAuthController.Signin);
    

    //set url for API v1 group routes
    app.use('/v1/api',apiRoutes);
}