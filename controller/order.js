"use strict";

const { nanoid } = require('nanoid');
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const database = require('../services/mongodb');
const { IDSIZE, DBERROR } = require('../util/constants');
const jwt = require('jsonwebtoken');
const Order = require('../model/orderModal')
const { ADMINSECRET, AUTHSECRET, MANAGERSECRET } = require('../config/secrets');
const { TOKENEXPIRE } = require('../util/constants')
const mailservices = require('../controller/email')



//create a order
exports.CreateOrder = async function (req, res, next) {
            let id = nanoid(IDSIZE);
            let uuid = mongoose.Types.ObjectId(id);
             let OrderPlace = new Order({
                orderid:uuid, 
                receiver:req.body.receiver, 
                seller:{
                    uuid:req.user.uuid,
                    name:req.user.name,
                    phone:req.user.phone,
                    email:req.user.email
                }, 
                payment:req.body.payment, 
                products:req.body.products,
                status: "Placed",  
                pickofflocation:req.body.pickofflocation,
                destinationlocation:req.body.destinationlocation,
                currentlocation:{}
            });  
           await database.createOrder(OrderPlace,req.user).then((val) => {
                if (val == null) {
                    throw Error("Error while creating order");
                } else {
                    mailservices.SendMail(req.user.email,"Order Placed","Dear user your order has been successfully placed our driver will contact you soon.").then((result)=>{ 
                        res.status(201).json({
                            message: "Order successfully created.",
                            order:val
                        }); 
                    }).catch((e)=>{
                        console.log(e);
                        res.status(401).json({
                            error:"Error with email services"
                        });
                    });
                   
                }
            }).catch((err) => {
                console.log(err);
                res.status(401).json({
                    error: DBERROR
                });
            });

        }
   
//get order or particular order by id;
 //get drivers or particular driver by id;
exports.GetOrder = async function(req,res,next){
    var ids = req.body.ids;
    var allorders=[];
     await database.readObjectsByIds(ids,"order").then((result)=>{
            allorders = result;
            return res.status(200).json({
                orders: allorders
            });
        }).catch((e)=>{
            console.log(e);
            return res.status(401).json({
                error: "Bad Request"
            });
        });
     
}
exports.GetOrderStatistics = async function(req,res,next){
  await database.readObjectsByIds(null,"order").then((val)=>{
        var total= val.length;
        var completed=[];
        var placed=[];
        var approved=[];
        var assigned=[];
        var shipping=[];
        var arrived=[];
        var rejected=[];
        for (let i=0;i<total;i++){
            var order =val[i]; 
            if(order.status=="Completed"){
                completed.push(order);
            }else if(order.status=="Placed"){
                placed.push(order);
            }else if(order.status=="approved"){
                approved.push(order);
            }else if(order.status=="assigned"){
                assigned.push(order);
            }
            else if(order.status=="rejected"){
                rejected.push(order);
            }
            else if(order.status=="arrived"){
                arrived.push(order);
            }
            
            else if(order.status=="shipping"){
                shipping.push(order);
            }
        }
        return res.status(200).json({
            total_orders:total,
            placed_orders:{
                counts:placed.length,
                orders:placed
            },
            completed_orders:{
                counts:completed.length,
                orders:completed
            },
            approved_by_admin:{
                counts:approved.length,
                orders:approved,
            },
            rejected_by_admin:{
                counts:rejected.length,
                orders:rejected
            },
            assigned_to_driver:{
                counts:assigned.length,
                orders:assigned
            },
            shipping:{
                counts:shipping.length,
                orders:shipping
            },
            arrived:{
                counts:arrived.length,
                orders:arrived,
            } 
        });
    }).catch((e)=>{
        console.log(e);
        return res.status(401).json({
            error: "Bad Request"
        });
    });
}

exports.GetSellerOrderStatistics = async function(req,res,next){
    await database.readUserByIds(req.user.products,"seller").then((val)=>{
          var total= val.length;
          var completed=[];
          var placed=[];
          var approved=[];
          var assigned=[];
          var shipping=[];
          var arrived=[];
          var rejected=[];
          for (let i=0;i<total;i++){
              var order =val[i]; 
              if(order.status=="Completed"){
                  completed.push(order);
              }else if(order.status=="Placed"){
                  placed.push(order);
              }else if(order.status=="approved"){
                  approved.push(order);
              }else if(order.status=="assigned"){
                  assigned.push(order);
              }
              else if(order.status=="rejected"){
                  rejected.push(order);
              }
              else if(order.status=="arrived"){
                  arrived.push(order);
              }
              
              else if(order.status=="shipping"){
                  shipping.push(order);
              }
          }
          return res.status(200).json({
              total_orders:total,
              placed_orders:{
                  counts:placed.length,
                  orders:placed
              },
              completed_orders:{
                  counts:completed.length,
                  orders:completed
              },
              approved_by_admin:{
                  counts:approved.length,
                  orders:approved,
              },
              rejected_by_admin:{
                  counts:rejected.length,
                  orders:rejected
              },
              assigned_to_driver:{
                  counts:assigned.length,
                  orders:assigned
              },
              shipping:{
                  counts:shipping.length,
                  orders:shipping
              },
              arrived:{
                  counts:arrived.length,
                  orders:arrived,
              } 
          });
      }).catch((e)=>{
          console.log(e);
          return res.status(401).json({
              error: "Bad Request"
          });
      });
  }

//admin action to verify order and send to driver driver
exports.VerifyOrder = async function(req,res,next){
    let driverid = req.body.driverid;
    let orderid=req.body.orderid;
    let action= req.body.action;

    if(orderid&&action&&action=="approved"||action=="rejected"){
     await  database.readObjectsByIds([orderid],"order").then((orders)=>{
            console.log(orders);
            if(orders.length==0)
            throw "No order available";
          var  order =orders[0];
            if(action=="rejected"){
                order.status="rejected";
                order.save().then((result)=>{ 
                    res.status(200).json({
                        order:result    
                    });
                }).catch((err)=>{
                    res.status(401).json({
                        error:"Error while updating the order"    
                    }); 
                });
                //update the order status to approved and assign it to the driver

            }else if(action=="approved"&&driverid){
                database.readUserByIds([driverid],"driver").then((drivers)=>{
                    if(drivers.length==0)
                    throw "No driver with this id  found";
                    let update_driver=drivers[0];
                    order.status="approved";
                    order.save().then((result)=>{
                       order=result;
                    }).catch((err)=>{
                        throw "Error while approving the order"
                    });
                    update_driver.orders.push(order.orderid);
                    update_driver.save().then((drvr)=>{
                        update_driver=drvr;
                    }); 
                    res.status(200).json({
                        status:"Order has been successfully approved",
                        order:order 
                    });
                    }).catch((e)=>{
                        console.log(e);
                        throw "Unable to find the driver by id"
                    });

            }else {
                res.status(401).json({
                    status:"Missing driverid"
                });
               
            } 
        }).catch((e)=>{
            console.log(e); 
             res.status(401).json({
                error: "No order with the id is available"
            });    
        });
    } else{
        return res.status(401).json({
            error: "Provide admin 'action' either approved or rejected"
        });
    }

  
}


 

 


