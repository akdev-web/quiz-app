import jwt from "jsonwebtoken";
import users from "../../models/user.js";
import { cookiesOptions, getAccessToken } from "../../lib/util/tokenGenerator.js";
import bcrypt from "bcryptjs";
import connectDB from "../../config/conn.js";

export default async function Refresh(req,res,next) {
    const auth = req.cookies.ACCESS;
    const requestedUser = req.user;
    if(!auth){
        return res.status(401).json({err:'Unauthorized',loggedout:true});
    }

    try {
        const payload = jwt.verify(auth,process.env.LOGIN_TOKEN_SECRET);
        if(payload){
            
            const user = await users.findOne({email:requestedUser.email}).select('-password');
            if(!user){
                return res.status(401).json({err:'Unauthorized',loggedout:true});
            }
                const user_id = user._id.toString();
                const match = bcrypt.compare(user_id,payload.token);
                if(!match){
                    return res.status(401).json({err:'Unauthorized',loggedout:true});
                }
                const accessToken = await getAccessToken(user_id);
                res.cookie('REFRESH',accessToken,cookiesOptions());
                return res.status(200).json({refreshed:true,msg:'client refreshed'});
            
        }
        return res.status(401).json({err:'Unauthorized',loggedout:true});
    } catch (error) {
        next(error);
        return res.status(500).json({err:'Unexpected Error'});
    }
}