import jwt from 'jsonwebtoken';
import users from '../../models/user.js'
import bcrypt from 'bcryptjs';
import connectDB from '../../config/conn.js';

export default async function ResetPass(req, res) {
    const { user } = req;
    const {password,confirm} = req.body;
    if(!password || !confirm) return res.status(400).json({err:'All fields are required !'});
    if(password !== confirm) return res.status(400).json({err:'Password and Confirm Password must be same !'}); 
    const token = req.cookies?.refreshToken;

    let user_access = null;
    if (token) {
        try {
            const access = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
            console.log(access);
            if (access?.email) {
                user_access = access;
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({ err: 'Cant process request at this moment . Try after some time !' });
        }
    }
    else {
        return res.status(400).json({ err: 'Request is expried . Try Again after some time !' });
    }

    await connectDB();
    const newPassword = await bcrypt.hash(password,10);
    const userdata = await users.findOneAndUpdate({email:user_access.email},{password:newPassword}, {new:true});
    res.status(200).json({success:true,msg:'pawword chaned successfully !'});
}