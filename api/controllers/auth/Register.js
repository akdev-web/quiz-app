import { serialize } from "cookie";
import connectDB from "../../config/conn.js";
import SendVeificationMail from "../../lib/SendVerificationMail.js";
import hashPassword from "../../lib/util/hashPassword.js";
import { getRefreshToken } from "../../lib/util/tokenGenerator.js";
import users from "../../models/user.js";

export default async function Register(req,res) {
    console.log(req.body);
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({err:'All Fields are required'});
        }
        await connectDB();
        const isExistingUser = await users.findOne({email}).select("username");
        if(isExistingUser){
            return res.status(400).json({err:'Email is already registered'});
        } 
        const newUser = {
            username,
            email,
            password:await hashPassword(password),
            isVerified:false,
        } 

        const newuser = await users.create(newUser);
        if(newuser){
            const mailResult  = await SendVeificationMail(email);
            if(mailResult){
              const {code} = mailResult ;
              newuser.verfCode = code;
              newuser.lastVerfCodeSentAt = Date.now();

              const usertoToken = {email:newuser.email,username:newuser.username,context:'verify'}
              const refreshToken = getRefreshToken(usertoToken)
                res.cookie('refreshToken',refreshToken,{
                    httpOnly:true,
                    path:'/',
                    maxAge:30*60*1000,
                    sameSite:'lax',
                    secure:false, 
                });
              await newuser.save();  
            }
            
            return res.status(201).json({success:true,msg:'User Registered ',user:newuser});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Unexpected Error'});
    }
    
}