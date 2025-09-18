import express from 'express';
import submitAnswer from '../../controllers/submitquiz/submitAnswer.js'
import CheckAccess from '../../Middlewares/CheckAccess.js';
import VerifyUser from '../../Middlewares/VerifyUser.js';
import ValidateQuiz from '../../Middlewares/ValidateQuiz.js';
import quizResult from '../../controllers/submitquiz/quizResult.js';
const Router = express.Router();

Router.get('/result/:id',CheckAccess,VerifyUser,ValidateQuiz,quizResult);
Router.post('/ans/:id/:quest',CheckAccess,VerifyUser,ValidateQuiz,submitAnswer);

export default Router;