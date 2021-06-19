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

    //********************seller APIs**************************    
    //once signup a request will be send to admin to verify account
    apiRoutes.post('/seller/signup',sellerAuthController.Signup);
    apiRoutes.post('/seller/signin',sellerAuthController.Signin);

    //get profile of user based on jwt decoding.
    apiRoutes.get('/seller/profile',auth.requireSellerAuth,sellerAuthController.GetProfile);
    //update profile
    apiRoutes.post('/seller/profile',auth.requireSellerAuth,sellerAuthController.UpdateProfile);
    //create a new order

    apiRoutes.post('/seller/order/create',auth.requireSellerAuth,OrderController.CreateOrder);
    apiRoutes.post('/seller/myorders',auth.requireSellerAuth,sellerAuthController.GetMyOrders,OrderController.GetOrder);

    apiRoutes.post('/seller/product/create',auth.requireSellerAuth,ProductController.CreateProduct);    
    apiRoutes.get('/seller/product',auth.requireSellerAuth,ProductController.GetProducts);
    

     //******************************************driver APIs********************************
    apiRoutes.post('/driver/signin',driverAuthController.Signin);
    apiRoutes.get('/driver/profile',auth.requireDriverAuth,driverAuthController.GetProfile);
    apiRoutes.post('/driver/order/verify',auth.requireDriverAuth,driverAuthController.OrderVerify);

    
    //***********************************admin APIs *****************************************
    apiRoutes.post('/admin/signin',adminAuthController.Signin);
    apiRoutes.post('/admin/newadmin',auth.requireAdminPermission,adminAuthController.NewAdmin);
    apiRoutes.post('/admin/newdriver',auth.requireAdminPermission,driverAuthController.Signup);


    
    //block or verify a seller
    apiRoutes.post('/admin/seller/changestatus',auth.requireAdminAuth,adminAuthController.ChangeSellerStatus);
    //block or unblock a seller
    apiRoutes.post('/admin/driver/changestatus',auth.requireAdminAuth,adminAuthController.ChangeDriverStatus);
    //admin order previledge 
    // if id as a query parameter is passed then info regarding single order will be provided either response will be whole list of orders.
    
    //assign a order to driver.
    apiRoutes.post('/admin/order/verify',auth.requireAdminPermission,OrderController.VerifyOrder);


    //fetch driver all or by id list
    apiRoutes.get('/admin/driver/details',auth.requireAdminPermission,driverAuthController.GetDriver);
    //similar to driver pass a list of ids or no ids to receive ids of all sellers
    apiRoutes.get('/admin/seller/details',auth.requireAdminAuth,sellerAuthController.GetSeller);
 
    
    //fetch order all or by id list
    apiRoutes.get('/admin/order/details',auth.requireAdminPermission,OrderController.GetOrder);
    apiRoutes.get('/admin/order/statistics',auth.requireAdminPermission,OrderController.GetOrderStatistics);
    apiRoutes.get('/admin/order/Placedetails',auth.requireAdminPermission,OrderController.GetPlacedOrder);
    //set url for API v1 group routes

    app.use('/v1/api',apiRoutes);
    app.use((req, res) => {
        res.status(404).send("Invalid request");
    });
    
    
}