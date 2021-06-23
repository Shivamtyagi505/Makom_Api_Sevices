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
    apiRoutes.get('/test/auth',auth.AuthManager); 

    //********************seller APIs**************************    
    //once signup a request will be send to admin to verify account
    apiRoutes.post('/seller/signup',sellerAuthController.Signup);
    apiRoutes.post('/seller/signin',sellerAuthController.Signin);

    //get profile of user based on jwt decoding.
    apiRoutes.get('/seller/profile',auth.AuthManager,sellerAuthController.GetProfile);
    //update profile
    apiRoutes.post('/seller/profile',auth.AuthManager,sellerAuthController.UpdateProfile);
    //create a new order
    apiRoutes.get('/seller/statistics',auth.AuthManager,OrderController.GetSellerOrderStatistics);
    apiRoutes.post('/seller/order/create',auth.AuthManager,OrderController.CreateOrder);
    apiRoutes.post('/seller/myorders',auth.AuthManager,sellerAuthController.GetMyOrders,OrderController.GetOrder);

    apiRoutes.post('/seller/product/create',auth.AuthManager,ProductController.CreateProduct);    
    apiRoutes.get('/seller/product',auth.AuthManager,ProductController.GetProducts);
    

     //******************************************driver APIs********************************
    apiRoutes.post('/driver/signin',driverAuthController.Signin);
    apiRoutes.get('/driver/profile',auth.AuthManager,driverAuthController.GetProfile);
    apiRoutes.get('/driver/order/myorders',auth.AuthManager,driverAuthController.GetOrders);
    apiRoutes.post('/driver/order/verify',auth.AuthManager,driverAuthController.OrderVerify);
    apiRoutes.post('/driver/order/status',auth.AuthManager,driverAuthController.UpdateStatus);
    apiRoutes.post('/driver/order/updatelocation',auth.AuthManager,driverAuthController.UpdateLocation);

    //***********************************admin APIs *****************************************
    apiRoutes.post('/admin/signin',adminAuthController.Signin);
    apiRoutes.post('/admin/newadmin',adminAuthController.NewAdmin);
    apiRoutes.post('/admin/newdriver',auth.AuthManager,driverAuthController.Signup);

    
    //block or verify a seller
    apiRoutes.post('/admin/seller/changestatus',auth.AuthManager,adminAuthController.ChangeSellerStatus);
    //block or unblock a seller
    apiRoutes.post('/admin/driver/changestatus',auth.AuthManager,adminAuthController.ChangeDriverStatus);
  //  apiRoutes.get('/admin/driver/search',auth.AuthManager,adminAuthController.SearchDriver);
    //admin order previledge 
    // if id as a query parameter is passed then info regarding single order will be provided either response will be whole list of orders.
    
    //assign a order to driver.
    apiRoutes.post('/admin/order/verify',auth.AuthManager,OrderController.VerifyOrder);


    //fetch driver all or by id list
    apiRoutes.post('/admin/driver/details',auth.AuthManager,driverAuthController.GetDriver);
    //fetch driver by name
    apiRoutes.post('/admin/driver/detailsByName',auth.AuthManager,driverAuthController.GetDriverByName);
    //similar to driver pass a list of ids or no ids to receive ids of all sellers
    apiRoutes.post('/admin/seller/details',auth.AuthManager,sellerAuthController.GetSeller);

    //fetch seller by name
    apiRoutes.post('/admin/seller/detailsByName',auth.AuthManager,sellerAuthController.GetSellerByName);
    
 
    
    //fetch order all or by id list
    apiRoutes.post('/admin/order/details',auth.AuthManager,OrderController.GetOrder);
    apiRoutes.get('/admin/order/statistics',auth.AuthManager,OrderController.GetOrderStatistics);
    //set url for API v1 group routes

    app.use('/v1/api',apiRoutes);
    app.use((req, res) => {
        res.status(404).send("Invalid request");
    });
    
    
}