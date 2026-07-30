require('dotenv').config()
const path = require('path');
const express= require ('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const authRoutes = require('./routes/user');
const logger = require("./config/logger");


const studentRoute= require("./routes/student.route");
const contactRoute= require("./routes/contact.route");
const taskRoute= require("./routes/task.routes")

const helmet = require("helmet");


const app=express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));


const speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000,   // 1 minute window
    delayAfter: 5,             // Allow 5 requests per minute without penalty
    delayMs: (hits) => (hits - 5) * 100, // Throttles request 6 by 100ms, request 7 by 200ms, etc.
});

// 2. Configure the Rate Limiter (Hard block users who go too far)
const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,   // 1 minute window
    limit: 10,                 // Strictly block after 10 requests per minute
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56,
    message: { error: 'Too many requests, please try again later' }
});

// 3. Apply them to your app (ORDER IS CRITICAL)
// app.use(speedLimiter); // First, slow them down...
// app.use(rateLimiter);  // ...then, block them if they don't take the hint.




mongoose.connect(process.env.MONGO_DB_URI).then( ()=>{
        console.log("add new student!");
}).catch(   (err)=>{
        console.log(err);
});

app.use("/API/student", studentRoute);
app.use("/API/auth", authRoutes);
app.use("/API/contact", contactRoute);

app.use("/api/tasks", taskRoute);

app.get(['/', '/index.html'], (req, res) => {

    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/health', (req, res) => {
     console.log(__dirname);
     console.log(path.join(__dirname, 'dist', 'index.html'));

    res.status(200).json({ status: 'ok' });
});

app.listen(process.env.PORT, ()=>{
    console.log("connected to server successfully!!")

})
