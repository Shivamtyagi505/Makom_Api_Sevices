var admin_sdk = require("firebase-admin");

var serviceAccount = require("../config/makom-firebase-admin.json");


admin_sdk.initializeApp({
    credential: admin_sdk.credential.cert(serviceAccount)
});

exports.SendMessage(body,title,token){
    const msg={
        notification:{
            title:title,
            body:body
        },
        token:token
    };
    admin_sdk.messaging().send(msg).then((response)=>{
        console.log('Successfully sent message');
    }).catch((err)=>{
        console.log('Error sending message:',err)
    });
}