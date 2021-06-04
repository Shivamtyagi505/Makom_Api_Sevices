const express = require('express');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const {PORT,DATABASE} = require('./config/main');
const logger = require('morgan');

const router = require('./router');

mongoose.connect(DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false,
})
mongoose.connection.on('error',console.error.bind(console,'connection error'))

/*** initials ***/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Enable CORS from client-side
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
/*** Start the Server ***/
server.listen(PORT, () => {
    console.log('Server Listening on port '+ PORT +'.');
  });
  
router(app);

