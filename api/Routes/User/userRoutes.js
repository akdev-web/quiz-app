import express from 'express';
import Profile from '../../controllers/user/Profile.js';
import CheckAccess from '../../Middlewares/CheckAccess.js';
import VerifyUser from '../../Middlewares/VerifyUser.js';
import uploadProfile from '../../Middlewares/uploadProfile.js';
import updateProfile from '../../controllers/user/updateProfile.js';

const Router = express.Router() 

Router.get('/profile',CheckAccess,Profile);
Router.post('/profile',CheckAccess,VerifyUser,uploadProfile,updateProfile);



export default Router;