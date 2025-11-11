import mongoose from 'mongoose';

export default async function connectDB(){
    if(mongoose.connection.readyState >=1 ){
        return ; // already connected
    }
    try {
        // const conn = await mongoose.connect('mongodb://localhost:27017/quiz-app');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected !');
         mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected! Trying to reconnect...');
            mongoose.connect(process.env.MONGO_URI);
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected!');
        });
    } catch (error) {
        console.log('Connection Error : ',error);
        throw error;
    }

   
}    