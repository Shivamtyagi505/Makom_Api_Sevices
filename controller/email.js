const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
 

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:"587",
    auth: {
        user: 'deliverymakom@gmail.com',
        pass: '#makom007#'
    }
});
async function SendMail(destination,subject,body) {
    const mailOptions = {
        from: 'Makom Delivery <deliverymakom@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
        to: destination,
        subject:  subject, // email subject
        html: `
        <h1>Makom Delivery Services</h1>
        <p style="font-size: 16px;">${body}</p> 
        <h6>Thank you</h6>
        <h6>Makom help support</h6>         
        ` // email content in HTML
    };
     
    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
        if(erro){
            console.log(erro);
              return null;
        }    
        console.log("Email send successfully");
        return true;
    });

};

module.exports={
    SendMail,
}