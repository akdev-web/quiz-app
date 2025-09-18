import jwt from 'jsonwebtoken'
export default async function CheckAccess(req,res,next) {
    const auth =  req.headers?.authorization?.split(' ')[1];
 if(auth){
        try {
            const payload = jwt.verify(auth,process.env.USER_TOKEN_SECRET);
            if(payload){
                req.authorized=true;
                req.user = {email:payload.user.email,username:payload.user.username};
                return next()
            }
        } catch (error) {
            return res.status(500).json({err:'Unexpected Error !'});
        }
    }
    return res.status(401).json({err:'Unauthorized Request'});   
}