import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config()


var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: 'boubakerabderrahman2003@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
  
  const sender = 'boubakerabderrahman2003@gmail.com'

  export const  sendVerificationEmail =async (email , verificationToken)=>{
    
       try
       {
          const mailOptions = {
              from: `boubaker <${sender}>` ,
              to: email,
              subject : 'Verification Email',
              html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
  
       }catch(err){
  
           throw new Error(`Email Verification sending failed ${err.message}`)
  
       }
       
       
  }


export const sendWelcomeEmail = async (email,username)=>{

    try
    {
       const mailOptions = {
           from: `boubaker <${sender}>` ,
           to: email,
           subject : 'Welcome Email',
           text :`you are welcome ${username}
            Dear ${username},

            Welcome ! We are thrilled to have you on board as part of our community. We encourage you to explore and make the most of your experience with us. If you have any questions or need assistance, feel free to reach out. We're here to help!
            `,
           
         };
         
         transporter.sendMail(mailOptions, function(error, info){
           if (error) {
             console.log(error);
           } else {
             console.log('Email sent: ' + info.response);
           }
         });

    }catch(err){

        throw new Error(`Welcome Email sending failed ${err.message}`)

    } 

}

export const sendResetPasswordEmail = async (email ,resetUrl) =>{


    try
    {
        const mailOptions = {
            from: `boubaker <${sender}>` ,
            to: email,
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetUrl),
            subject : 'Reset Password',
            
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        console.log("Reset Password Email sent successfully" , response)

    }catch(err){
        throw new Error(`Reset Password Email Verification sending failed ${err.message}`)

    }


}

export const sendResetPasswordSuccessfullyEmail = async (email)=>{


    try 
    {
        const mailOptions = {
            from: `boubaker <${sender}>` ,
            to: email,
            subject : 'Password Reset Successfully',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        console.log('Reset success Email sent successfully' )
    }catch(err){
        console.log(err)
        throw new Error('success Reset Email sending failed')

    }
}