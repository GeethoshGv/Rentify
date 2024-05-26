import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
import listingRouter from './routes/listingRoute.js'

import cookieParser from 'cookie-parser';
import path from 'path'


dotenv.config()

mongoose.connect(process.env.MONGOURI).then(() => {
    console.log("conected to DB");
}).catch((err) => {
    console.log(err);
})

const __dirname = path.resolve();

const app = express()

app.use(express.json())
app.use(cookieParser())

//==============api route=================

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

//==============api route=================

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


//==============middleware=================

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'internal server error'
    return res.status(statusCode).json({
        statusCode, message, success: false
    })
})
//==============middleware=================


app.listen(3000, () => {
    console.log("server is running 3000");
})