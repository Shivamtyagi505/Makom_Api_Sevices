const express = require('express');

const testController = require('./controller/test');



module.exports= function(app){
    //initialising api routes
    const apiRoutes = express.Router();

    //test APIs
    apiRoutes.get('/test/hello',testController.getRequest);
    apiRoutes.post('/test/helo',testController.postRequest);




    //set url for API v1 group routes
    app.use('/v1',apiRoutes);

}