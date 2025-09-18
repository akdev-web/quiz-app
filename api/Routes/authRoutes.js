import express from 'express';
import Register from '../controllers/auth/Register.js';
import Login from '../controllers/auth/Login.js';
import Verify from '../controllers/auth/Verify.js';
import HandleVerifyRequest from '../controllers/auth/VerifyReq.js';
import Refresh from '../controllers/auth/Refresh.js';
import CheckAccess from '../Middlewares/CheckAccess.js';
import ResetPass from '../controllers/auth/ResetPass.js';
const Router = express.Router();

Router.get('/refresh',CheckAccess,Refresh);
Router.post('/register',Register);
Router.post('/req/verify',HandleVerifyRequest)
Router.post('/verify',Verify)
Router.post('/reset-pass',ResetPass)
Router.post('/login',Login);

export default Router;