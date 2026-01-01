import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import users from '../models/user.js';


export default async function VerifyUser(req,res,next) {
    const auth1 = req.cookies.ACCESS;
    const auth2 = req.cookies.REFRESH;

    if(!auth1){
        return res.status(401).json({err:'Unauthorized Request !',loggedout:true});
    }
    if(!auth2){
        return res.status(401).json({err:'Unauthorized ',refreshClient:true});
    }

    try {
        const payload1 = jwt.verify(auth1,process.env.LOGIN_TOKEN_SECRET);
        const payload2 = jwt.verify(auth2,process.env.ACCESS_TOKEN_SECRET);


        if(!payload1 || !payload2){
            return res.status(401).json({err:'Unauthorized Request',loggedout:true});
        }

        const user = await users.findOne({email:req.user.email}).select('username');
        if(user){
            const match = bcrypt.compare(user._id.toString(),payload2.token);
            if(match){
                req.user.id = user._id;
                return next()
            }
        }

        return res.status(401).json({err:'Unauthorized Request',loggedout:true});
        
         
    } catch (error) {
        return res.status(500).json({err:'Unexpected Error !'});
    }
    
}