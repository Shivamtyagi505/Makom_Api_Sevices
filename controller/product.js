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

        exports.DeleteProducts = async function(req,res,next){
            let ids = req.user.products;
            Seller.findByIdAndRemove(ids)
            .then(data => {
                if(!data) {
                    return res.status(404).send({
                        message: "Note not found with id " + ids
                    });
                }
                res.send({message: "Note deleted successfully!"});
            }).catch(err => {
                if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "Note not found with id " + ids
                    });                
                }
                return res.status(500).send({
                    message: "Could not delete note with id " + ids
                });
            });
        };
        
