"use strict";

const { nanoid } = require('nanoid');
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');
const jwt = require('jsonwebtoken');
const Product = require('../model/productModal')
const Seller = require('../model/sellerModal');
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')



//create a order
exports.CreateProduct = async function (req, res, next) {
            let id = nanoid(IDSIZE);
            let uuid = mongoose.Types.ObjectId(id);
             let product = new Product({
                product_id:uuid, 
                product_name:req.body.product_name,
                product_price:req.body.product_price,
                product_category:req.body.product_category,
                product_weight:req.body.product_weight,
                delivery_type:req.body.delivery_type,
            });  
            console.log("this is user"+req.user);
            
           await database.createProduct(product,req.user).then((val) => {
                if (val == null) {
                    throw Error("Error while creating order");
                } else {
                    res.status(201).json({
                        message: "Product successfully added to inventory.",
                        product:val
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(401).json({
                    error: DBERROR
                });
            });
        }

        //fetch all seller products
        
        exports.GetProducts = async function(req,res,next){
            let ids = req.user.products;
           await database.readObjectsByIds(ids,"product").then((val)=>{
                return res.status(200).json({
                    products: val,
                    count: ids.length
                });
            }).catch((e)=>{
                console.log(e);
                return res.status(401).json({
                    error: "Bad Request"
                });
            });
        }

        exports.RemoveProducts = async function(req,res,next){
            let ids = req.body.ids;
            let seller= req.user;
            for (let i=0;i<ids.length;i++){
                seller.products.pop(ids[i]);
            }
          await seller.save().then((result)=>{
                Product.deleteMany({product_id:ids}).then(data=>{
                    res.status(200).json({
                       msg:"product removed successfully" 
                    })
                }).catch((err)=>{
                    res.status(401).json({
                        error:"Error no product with these ids exists" 
                     })
                })
            }).catch((err)=>{
                res.status(401).json({
                    error:"Error communicating with database" 
                 })
            })
        };
        
