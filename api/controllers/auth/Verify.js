
import users from '../../models/user.js'
import { getRefreshToken } from '../../lib/util/tokenGenerator.js';
import jwt from 'jsonwebtoken';
export default async function Verify(req, res,next) {
    const {code } = req.body;
    if (!code) {
        return res.status(401).json({ err: 'Invalid Code'});
    }

    const token = req.cookies?.refreshToken;

    let user_access =null;
    if(token){
        try {
            const access = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
            if(access?.email){
                user_access = access;
            }
        } catch (error) {
            return res.status(400).json({err:'Cant process request at this moment . Try after some time !'});
        }
    }
    else{
        return res.status(400).json({err:'Request is expried . Try after some time !'});
    }

    try {
        const {email,context} = user_access;
        const user = await users.findOne({ email }).select('-password');

        if (!user || !user.verfCode) {
            return res.status(401).json({ err: 'Invalid Request ! Please try again later !' });
        }

        if (user.verfCode && (user.verfCode != code)) {
            return res.status(401).json({err:'Incorrect code !'});
        }
        
        const isCodeExpried = (Date.now()-new Date(user.lastVerfCodeSentAt) ) > 1000*60*25;
        if(isCodeExpried){
            return res.status(401).json({err:'Your code is Expired ! Resend code and Try Again'});
        }

        const usertoToken = {email:user.email,username:user.username}
        const refreshToken = getRefreshToken(usertoToken);
        if(context === 'reset'){
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                path:'/',
                maxAge:15*60*1000,
                sameSite:  process.env.NODE_ENV === 'PRODUCTION' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'PRODUCTION',
            });
        }   

        user.isVerified = true;
        user.verfCode = null;
        user.lastVerfCodeSentAt = null;
        await user.save();

        if(context === 'reset'){
            return res.status(200).json({success:true,msg:'Code verified ',reset:true})
        }
        return res.status(200).json({success:true,msg:'email verified '})
    } catch (error) {
        next(error);
        res.status(500).json({err:'Unexpected Error '});
    }

}