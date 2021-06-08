const express = require('express');

const testController = require('./controller/test');
const sellerAuthController = require('./controller/seller');
const adminAuthController = require('./controller/admin');
const driverAuthController = require('./controller/driver');
const OrderController =  require('./controller/order');
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
    apiRoutes.post('/seller/profile',auth.requireSellerAuth,sellerAuthController.UpdateProfile);
    apiRoutes.post('/seller/order/create',auth.requireSellerAuth,OrderController.CreateOrder);
   
   
    
    //admin APIs 
    apiRoutes.post('/admin/signin',adminAuthController.Signin);
    apiRoutes.post('/admin/newdriver',auth.requireAdminPermission,driverAuthController.Signup);
    apiRoutes.get('/admin/order',auth.requireAdminPermission,OrderController.GetOrder);

    //Admin get request to get driver and seller details;
    apiRoutes.get('/admin/driver',auth.requireAdminPermission,adminAuthController.GetDriver);
    apiRoutes.get('/admin/seller',auth.requireAdminPermission,adminAuthController.GetSeller);
    apiRoutes.post('/admin/seller/changestatus',auth.requireAdminPermission,adminAuthController.ChangeSellerStatus);


    //driver APIs
    apiRoutes.post('/driver/signin',driverAuthController.Signin);
    apiRoutes.get('/driver/profile',auth.requireDriverAuth,driverAuthController.GetProfile);
    
    
    //set url for API v1 group routes
    app.use('/v1/api',apiRoutes);
}