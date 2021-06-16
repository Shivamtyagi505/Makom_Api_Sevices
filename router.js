const express = require('express');

const testController = require('./controller/test');
const sellerAuthController = require('./controller/seller');
const adminAuthController = require('./controller/admin');

const ProductController = require('./controller/product');
const driverAuthController = require('./controller/driver');
const OrderController =  require('./controller/order');

const auth = require('./util/authorisation');


module.exports= function(app){
    
    //initialising api routes
    const apiRoutes = express.Router();

    //test APIs 
    apiRoutes.get('/test/hello',testController.getRequest);
    apiRoutes.post('/test/hello',testController.postRequest);

    //seller APIs    
    //once signup a request will be send to admin to verify account
    apiRoutes.post('/seller/signup',sellerAuthController.Signup);
    apiRoutes.post('/seller/signin',sellerAuthController.Signin);

    //get profile of user based on jwt decoding.
    apiRoutes.get('/seller/profile',auth.requireSellerAuth,sellerAuthController.GetProfile);
    //update profile
    apiRoutes.post('/seller/profile',auth.requireSellerAuth,sellerAuthController.UpdateProfile);
    
    //similar to driver pass a list of ids or no ids to receive ids of all driver
    apiRoutes.get('/seller/details',auth.requireCommonAuth,sellerAuthController.GetSeller);
    
    //create a new order

    apiRoutes.post('/seller/order/create',auth.requireSellerAuth,OrderController.CreateOrder);
    apiRoutes.post('/seller/myorders',auth.requireSellerAuth,sellerAuthController.GetMyOrders,OrderController.GetOrder);

    apiRoutes.post('/seller/product/create',auth.requireSellerAuth,ProductController.CreateProduct);    
    apiRoutes.get('/seller/product',auth.requireSellerAuth,ProductController.GetProducts);
    

    
    //admin APIs 
    apiRoutes.post('/admin/signin',adminAuthController.Signin);
   
    apiRoutes.post('/admin/newadmin',auth.requireAdminPermission,adminAuthController.NewAdmin);
    
    //Admin get request to get driver and seller details;
    apiRoutes.post('/admin/newdriver',auth.requireAdminPermission,driverAuthController.Signup);


    
    //block or verify a seller
    apiRoutes.post('/admin/seller/changestatus',auth.requireAdminPermission,adminAuthController.ChangeSellerStatus);
    //block or unblock a seller
    apiRoutes.post('/admin/driver/changestatus',auth.requireAdminPermission,adminAuthController.ChangeDriverStatus);
    //admin order previledge 
    // if id as a query parameter is passed then info regarding single order will be provided either response will be whole list of orders.
    
    //assign a order to driver.
    apiRoutes.post('/admin/order/verify',auth.requireAdminPermission,OrderController.VerifyOrder);


    //driver APIs
    apiRoutes.post('/driver/signin',driverAuthController.Signin);
    apiRoutes.get('/driver/profile',auth.requireDriverAuth,driverAuthController.GetProfile);
    apiRoutes.post('/driver/order/verify',auth.requireDriverAuth,driverAuthController.OrderVerify);
    // if id as a query parameter is passed then info regarding single driver will be provided either response will be whole list of sellers. 
    apiRoutes.get('/admin/driver/details',auth.requireAdminPermission,driverAuthController.GetDriver);
    
    //fetch order by id
    apiRoutes.get('/admin/order/details',auth.requireAdminPermission,OrderController.GetOrder);
    
    //set url for API v1 group routes
    app.use('/v1/api',apiRoutes);

    
}