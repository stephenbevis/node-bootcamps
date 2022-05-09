// Imports
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// Load Environment Variables
dotenv.config({
    path: './config/config.env'
})

// Connect To MongoDB
connectDB()

// Initialize App
const app = express()

// Body Parser
app.use(express.json())

// Route Files
const bootcamps = require('./routes/bootcamps')

// Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server Running: Port ${PORT}`))

// Handle Promise Rejections
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`)
    
    // Close Server & Exit Process
    server.close(() => process.exit(1))
})