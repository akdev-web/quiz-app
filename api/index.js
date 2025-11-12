
import express from 'express';
import env from 'dotenv';
env.config();
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/User/userRoutes.js'
import quizRoutes from './Routes/Quiz/quizRoutes.js'
import quizSubmitRoutes from './Routes/Quiz/quizSubmitRoutes.js'
import dashboardRoutes from './Routes/User/dashboardRoutes.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/conn.js';




const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin:process.env.CLIENT_URL,
    credentials:true,
}

app.use(cors(corsOptions));

connectDB().then(() => {
  console.log('DB ready, starting server...');
}).catch(err => {
  return console.error('Failed to start server because DB not ready:', err);
});

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/quiz',quizRoutes);
app.use('/api/submit_quiz',quizSubmitRoutes);
app.use('/api/dashboard',dashboardRoutes);




app.listen(process.env.PORT, () => {
    return console.log(`Server is listening on PORT : ${process.env.PORT}`);
})