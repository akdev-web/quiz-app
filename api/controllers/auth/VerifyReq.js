
import SendVeificationMail from "../../lib/SendVerificationMail.js";
import {  getRefreshToken } from "../../lib/util/tokenGenerator.js";
import users from "../../models/user.js";
import jwt from "jsonwebtoken";

export default async function HandleVerifyRequest(req,res,next) {
    let {email,context} = req.body;
    if(!email){
        const token = req.cookies?.refreshToken;
        if(token){
            try {
                const user = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
                if(user?.email){
                    email = user.email;
                }else{
                    return res.status(401).json({err:'Invalid Request ! Try again or Resend email'});
                }
            } catch (error) {
                next(error)
                return res.status(401).json({err:'Invalid Request ! Try again or Resend email'});
            }
        }else{
            const isResendcontext = (context && context === 'resend');
            if(isResendcontext){
                return res.status(401).json({err:'Request Expried, Try again after some time !'});
            }
            return res.status(400).json({err:'Invalid Email'});
        }
    }

    try {
        const user = await users.findOne({email})
        if(!user){
            return res.status(400).json({err:'Email Not registerd or is invalid'});
        }
        if(user.isVerified && ( context !== 'reset') ){
            return res.status(400).json({err:'Email is Already Verified !'});
        }
        if((Date.now() - new Date(user.lastVerfCodeSentAt)) < 2*60*1000){
            return res.status(429).json({err:'Plase wait for 2 Minutes to Resend Mail !'});
        }
        if(user.verifyAttempts?.count >= 3){

            const twoHours = 1000*60*60*2;
            const cooldownTill = new Date(user.lastVerfCodeSentAt).getTime() + twoHours;
            const cooldownRemaining = new Date(cooldownTill) - Date.now();
            if(cooldownRemaining > 0) // if cooldown time is remaining
            {
                const totalMinutes = Math.floor(cooldownRemaining / (1000*60));
                const remainingHours = Math.floor(totalMinutes / 60);
                const remainingMinutes = totalMinutes % 60;
                const timeRemaining = `${remainingHours > 0 && remainingHours}h ${remainingMinutes>0 && remainingMinutes}m`;
                return res.status(429).json({err:` you can only request verification 3 times within 2 hours. Please try again after ${timeRemaining}!`});
            } 
        }

        const {code} = await SendVeificationMail(email);
        const timeNow = Date.now();
        
        const firstAttemptOfDay = new Date(user.verifyAttempts.firstAttempt);
        const TwoHours = 1000*60*60*2;

        if(user.verifyAttempts.count > 0 && 
            (Date.now() - firstAttemptOfDay) < TwoHours){
                user.verifyAttempts.count +=1;
        }
        else
        {
            user.verifyAttempts.count = 1;
            user.verifyAttempts.firstAttempt = timeNow;
        }
        
        user.verfCode = code;
        user.lastVerfCodeSentAt = timeNow;

        const usertoToken = {email:user.email,username:user.username,context}
        const refreshToken = getRefreshToken(usertoToken)
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            path:'/',
            maxAge:30*60*1000,
            sameSite:  process.env.NODE_ENV === 'PRODUCTION' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'PRODUCTION',
        });

        await user.save();
        return res.status(200).json({success:true,msg:' Mail with a verfication code Sent Successfully .'});
        
    } catch (error) {
        next(error);
        res.status(200).json({err:'Unexpected Error'});
    }
}