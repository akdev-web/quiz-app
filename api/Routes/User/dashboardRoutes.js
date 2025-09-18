import express from 'express';
import CheckAccess from '../../Middlewares/CheckAccess.js';
import VerifyUser from '../../Middlewares/VerifyUser.js';
import getUserQuiz from '../../controllers/dashboard/getUserQuiz.js';
import dashBoardResult from '../../controllers/dashboard/dashBoardResult.js';

const Router = express.Router();

Router.get('/quiz',CheckAccess,VerifyUser,getUserQuiz)

Router.get('/result/:quizId',CheckAccess,VerifyUser,dashBoardResult)


export default Router;