
import express from 'express';
import env from 'dotenv';
env.config();
import axios from 'axios';
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/User/userRoutes.js'
import quizRoutes from './Routes/Quiz/quizRoutes.js'
import quizSubmitRoutes from './Routes/Quiz/quizSubmitRoutes.js'
import dashboardRoutes from './Routes/User/dashboardRoutes.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';




const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true,
}
app.use(cors(corsOptions));

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/quiz',quizRoutes);
app.use('/api/submit_quiz',quizSubmitRoutes);
app.use('/api/dashboard',dashboardRoutes);




app.listen(3000, () => {
    return console.log('Server running on port : 3000');
})