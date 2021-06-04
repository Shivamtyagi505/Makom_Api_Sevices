"use strict";

const { nanoid } = require('nanoid');
const bcrypt =require('bcrypt');
const database = require('../services/mongodb');
const {IDSIZE} = require('../util/constants');

exports.Signup = function(req,res,next){
    try{ 
    bcrypt.hash(req.body.password,10).then(
        (hash)=>{ 
            database.createSeller(req.body.email,hash).then((val)=>{
               if(val==null){
                 throw Error("Error while setting account");  
            }else{ 
                res.status(201).json({
                    message:"seller account successfully created."
                });         
            }
            }).catch((err)=>{
              console.log(err);  
                res.status(401).json({
                error:err.message
            });
            });
        } 
    ); 
    }catch(err){
        res.status(401).json({
          error:"Error while processing your request."
        });
    }   
}
exports.Signin = async function(req,res,next){
   var dbuser=null;
    try{
      await  database.readSeller(req.body.email).then((val)=>{
          dbuser =val; 
        }); 

        if(dbuser!=null){
           await bcrypt.compare(req.body.password,dbuser.password,function(err,result){
                if(result){ 
                    res.status(200).json({
                        message:"Successfully logged in"
                    });
                } else{
                    res.status(401).json({
                        error:"Invalid credentials"
                    });   
                }
             });
         }else{
             throw "no user found";
         }
    }catch(e){ 
        res.status(401).json({
            error:e
        });   
    }


};