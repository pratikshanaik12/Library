require('dotenv').config({ path: `${process.cwd()}/.env` })
const express = require('express')
const authRouter = require('./route/authRoute')
const librarianRouter = require('./route/librarianRoute')
const errorController = require('./controller/errorController')
const commonRouter = require('./route/commonRoute')
const customerRouter = require('./route/customerRoute')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
  }))
app.use(express.json())
app.use(cookieParser());



app.get('/', (req, res)=>{
    res.status(200).json(
        {
            status: 'success',
            message: 'Successful'
        }
    )
})

//  all routes

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/librarian', librarianRouter);
app.use('/api/v1/common', commonRouter )
app.use('/api/v1/customer', customerRouter )
app.use('*', async(req, res, next) =>{
    return next(new Error('Route not found'))
    
    
})

app.use(errorController);

const PORT = process.env.APP_PORT || 3000

app.listen(PORT, ()=>{
    console.log('Server up and running', PORT)
})