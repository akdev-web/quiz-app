import express from 'express';
import newQuiz from '../../controllers/quiz/newQuiz.js';
import getQuiz from '../../controllers/quiz/getQuiz.js';
import CheckAccess from '../../Middlewares/CheckAccess.js';
import VerifyUser from '../../Middlewares/VerifyUser.js';
import updateQuiz from '../../controllers/quiz/updateQuiz.js';
import addQuiz from '../../controllers/quiz/addQuiz.js';
import getQuestions from '../../controllers/quiz/getQuestions.js';
import ValidateQuiz from '../../Middlewares/ValidateQuiz.js';
import progress from '../../controllers/quiz/progress.js';
import deleteQuiz from '../../controllers/quiz/deleteQuiz.js';
import UploadThumbnail from '../../Middlewares/UploadThumbnail.js';
import removeQuestion from '../../controllers/quiz/removeQuestion.js';
import VerifyQuizOwnership from '../../Middlewares/VerifyQuizOwnership.js';

const Router = express.Router();

Router.get('/',CheckAccess,VerifyUser,getQuiz);

Router.post('/new',CheckAccess,VerifyUser,UploadThumbnail,newQuiz); // create new quiz
Router.post('/add',CheckAccess,VerifyUser,addQuiz); // add and update questions

Router.put('/update/:id',CheckAccess,VerifyUser,VerifyQuizOwnership,UploadThumbnail,updateQuiz); // update quiz details
Router.delete('/:id/remove',CheckAccess,VerifyUser,VerifyQuizOwnership,deleteQuiz) // delete quiz

Router.get('/progress/:id',CheckAccess,VerifyUser,ValidateQuiz,progress); // get pariticapted progress

Router.get('/:id/:quest',CheckAccess,VerifyUser,ValidateQuiz,getQuestions); // get specific question
Router.delete('/remove_quest',CheckAccess,VerifyUser,removeQuestion); // delete specific question
Router.get('/:id',CheckAccess,VerifyUser,ValidateQuiz,getQuestions); // get all questions 

export default Router;