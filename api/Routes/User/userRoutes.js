import express from 'express';
import Profile from '../../controllers/user/Profile.js';
import CheckAccess from '../../Middlewares/CheckAccess.js';

const Router = express.Router() 

Router.get('/profile',CheckAccess,Profile);


export default Router;