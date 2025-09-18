import mongoose from 'mongoose';

export default async function connectDB(){
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/quiz-app');
        if(conn){
            console.log('database connected !');
        }
    } catch (error) {
        console.log('Connection Error : ',error);
    }
}    