import bcrypt from "bcryptjs";
import connectDB from "../../config/conn.js";
import users from "../../models/user.js";
import { cookiesOptions, getAccessToken, getLoggedInToken, getUserJwtToken } from "../../lib/util/tokenGenerator.js";

export default async function Login(req,res) {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({err:'Email or Password is required'});
    }

    try {
        const user = await users.findOne({email});
        if(!user){
            return res.status(401).json({err:'Email Not found or Not registered'});
        }
        if(!user.isVerified){
            return res.status(400).json({err:'Please verify your email before login !',forceVerify:true});
        }


        const match = await bcrypt.compare(password,user.password);

        const max_attempts = 3;
        const block_minutes = 15*60*1000;
        const now = Date.now()
        const {loginAttempts} = user;
        const timeAfterFirstAttempt = now-new Date(loginAttempts.firstAt);
        const isBlocked = (loginAttempts.count >=3) && (timeAfterFirstAttempt < block_minutes)

        if(isBlocked){
            const timeLeft = Math.ceil((block_minutes - timeAfterFirstAttempt) / 60000);
            return res.status(429).json({err:`Account temporarily locked due to multiple failed attempts. Try again in ${timeLeft} minute(s). if you forget your password try restet it !`});
        }

        if(!match){

           if(!user.loginAttempts.firstAt || (now - new Date(user.loginAttempts.firstAt) > block_minutes )){
                user.loginAttempts = {
                    count:1,
                    firstAt:now,
                    lastAt:now,
                }
           }else{
                user.loginAttempts.lastAt = now;
                user.loginAttempts.count+=1;
           }
 
           await user.save();

           if(user.loginAttempts.count >= max_attempts){
                return res.status(429).json({err:'Too many failed attempts. Please reset your password to continue or try again after some time.'})
           }
           return res.status(401).json({err:`Incorrect password. You have ${max_attempts - user.loginAttempts.count} attempts left.`})
        }

        const accessToken = await getAccessToken(user._id);
        const loginToken = await getLoggedInToken(user._id);
        let userdata = {email:user.email,username:user.username};
        if(user.profile?.url){
            userdata = {...userdata,profile:user.profile.url};
        }
        const useraccess = getUserJwtToken(userdata);

        res.cookie('ACCESS',loginToken,cookiesOptions({maxAge:1000*60*60*24*30}));
        res.cookie('REFRESH',accessToken,cookiesOptions());

        return res.status(200).json({success:true,msg:'Login Successfully',access:useraccess});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Unexpected Error !'});
    }
    
}