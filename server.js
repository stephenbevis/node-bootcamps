// Imports
const express = require('express')
const dotenv = require('dotenv')

// Load Environment Variables
dotenv.config({
    path: './config/config.env'
})

// Initialize App
const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server Running: Port ${PORT}`))