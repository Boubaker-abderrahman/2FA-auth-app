import { User } from "../models/userSchema.js "
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendResetPasswordEmail, sendResetPasswordSuccessfullyEmail, sendVerificationEmail ,sendWelcomeEmail} from "../mailtrap/emails.js"

import crypto from 'crypto'

const signUp =  async (req,res)=>{
    const {email , name , password} = req.body
    try 
    {
        if(!email || !name || !password){
            throw new Error('All field Are Required')
        }

        const userAlreadyExists = await User.findOne({email})

        if(userAlreadyExists){
            throw new Error('Email Already Used')
        }

        const hashedPass =await bcrypt.hash(password , 10)

        const verificationToken =  Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email,
            name,
            password: hashedPass,
            verificationToken,
            verificationTokenExpiresAt : Date.now() +24*60*60*1000
        })

        await user.save()

        //jwt
        generateTokenAndSetCookie(res,user._id)

        sendVerificationEmail(user.email,verificationToken)

        res.status(201).json({
            success :true,
            message : 'user created successfully',
            user : {...user._doc , password : undefined}

        })


    }catch(err){
        res.status(400).json({success : false , message : err.message})

    }
}

const verifyEmail = async (req,res)=>{

    const {code} = req.body
    try{

        const user = await User.findOne({verificationToken : code ,
            verificationTokenExpiresAt : { $gt: Date.now()}
        })
        if(!user) {throw new Error('Invalid or Expired verification code')}
        
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        await user.save()

        await sendWelcomeEmail(user.email , user.name)

        res.status(200).json({success : true , message : 'verification complete'})

    }
    catch(err){
        console.log("Problem with verification Error")
        res.status(401).json({success :false , message :`${err}`})

    }



}

const logIn = async (req,res)=>{
    const {email,password} = req.body


    try {

        if(!email || !password){throw new Error("All input are required")}

        const user = await User.findOne({email})

        if(!user) { throw new Error('User does not exist please verify your email ')}

        const passwordMatch = await bcrypt.compare(password , user.password)

        if(!passwordMatch){throw new Error('Invalid email or password')}

        
        generateTokenAndSetCookie(res,user._id)
        
        user.lastLogin = Date.now()

        await user.save()
        
        
        res.status(200).json({success : true , message : 'logged in successfully' , user:{...user._doc , password : undefined}})
    
    }catch(err){
        res.status(400).json({success : false , message : ` ${err}`})

    }




}


const logOut= (req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success : true , message : 'logged out successfully'})
}


const forgotPassword = async (req ,res)=>{

    const {email} = req.body

    try
    {
        if(!email){throw new Error('Invalid Email')}

        const user = await User.findOne({email})

        if(!user){throw new Error('User does not exist')}
        
        //generate token
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = Date.now() + 1 *60*60*1000 // 1h

        await user.save()

        await sendResetPasswordEmail(email , `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({success : true , message : 'Reset Email sent '})




    }catch(err){
        res.status(401).json({
            success : false,
            message: err.message

        })
    }
}

const resetPassword = async (req,res)=>{

    const {token} = req.params

    const {newPassword} = req.body
    
    try
    {
         const user =await User.findOne({resetPasswordToken:token , resetPasswordExpiresAt : {$gt :Date.now()}})

         if(!user){throw new Error('Invalid Token')}


         user.resetPasswordToken = undefined
         user.resetPasswordExpiresAt=undefined

         const newHashedPassword = await bcrypt.hash(newPassword,10)

         user.password = newHashedPassword

         
         await user.save()

         await sendResetPasswordSuccessfullyEmail(user.email)

         res.status(200).json({success : true , message : 'Password Reset successfully'})

         
        
    }catch(err){
        console.log(err)

        res.status(401).json({success : false ,message : err})
    }







}

const authCheck = async (req,res)=>{

    
    try{
        const user = await User.findById(req.userId).select('-password')

        if(!user){throw new Error ('User Not Found')}

        res.status(200).json({success: true ,user, message : 'Authentication checked successfully'})
    }
    catch(err){
        console.log("Error in checkAuth ", err);
        res.status(400).json({success:false , message :err})
    }

}

 const authControllers = {
    logIn,
    logOut,
    signUp,
    verifyEmail,
    forgotPassword,
    resetPassword,
    authCheck

 }
    
 
 export default authControllers
