// Imports
const express = require('express')
const dotenv = require('dotenv')

// Load Environment Variables
dotenv.config({
    path: './config/config.env'
})

// Initialize App
const app = express()

// Route Files
const bootcamps = require('./routes/bootcamps')

// Routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server Running: Port ${PORT}`))