import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    email : {
        type : String,
        required :true,
        unique : true
    },
    name : {
        type : String,
        required :true
    },
    password : {
        type : String,
        required :true
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    lastLogin : {
        type: Date,
        default : Date.now
    },
    resetPasswordToken : String,
    resetPasswordExpiresAt : Date,
    verificationToken :String,
    verificationTokenExpiresAt : Date,

},{timestamps: true}) 

export const User = mongoose.model('User' ,userSchema )