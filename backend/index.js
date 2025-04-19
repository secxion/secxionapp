const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const app = express()

const frontendURL = process.env.FRONTEND_URL;

const corsOptions = {
    origin : frontendURL,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials : true,
    allowedHeaders : 'Content-Type, Authorization',
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api",router)


const PORT = 5000 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})