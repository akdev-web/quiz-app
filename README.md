# Quiz App
A MERN stack quiz application with authentication and timer.

## Features
- User signup & login with JWT
- Email verification
- Quiz timer & ranking
- Quiz Result ( Summary &  Details for each Answerd Question )
- Responsive UI with Tailwind

## Tech Stack
React, Node.js, Express, MongoDB, Tailwind

## Installation & Setup Guide

Please make sure the following are installed before setting up the project:
- Node.js and npm
- MongoDB Server

### 🚀 Clone the Repository
- git clone https://github.com/akdev-web/quiz-app

### 🛠 Backend Setup (API)
1. Navigate to the API folder
   - cd api

2. Install dependencies
   - npm install

3. Configure Environment Variables
   Create a .env file inside the api folder and add:
    
   - ACCESS_TOKEN_SECRET=your_random_string
   - LOGIN_TOKEN_SECRET=your_random_string
   - REFRESH_TOKEN_SECRET=your_random_string
   - USER_TOKEN_SECRET=your_random_string
    
   - CLIENT_URL=http://localhost:5173
    
   - CLOUDINARY_API_KEY=your_cloudinary_api_key
   - CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   - CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    
   - MONGO_URI=mongodb://localhost:27017/your_database_name at your local machine OR mongodb-service-url
    
   - NODE_ENV=local
   - PORT=5000
    
   - SMTP_MAIL_ADDRESS=your_email_address_used_for_smtp
   - SMTP_PASS_KEY=password_or_app_key_provided_by_your_email_provider

4. Start the Backend
   - npm start

### Frontend Setup (Vite + React)

1. Navigate to the Client folder
   - cd client

2. Install dependencies
   - npm install

3. Configure Frontend Environment Variables
   Create a .env file inside client folder and add VITE_API_URL=http://localhost:5000

4. Start the Frontend
   - npm run dev


Your frontend will run at:
http://localhost:5173



  
  
  
