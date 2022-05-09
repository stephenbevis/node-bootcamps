// Imports
const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load ENV Variables
dotenv.config({
    path: './config/config.env'
})

// Models
const Bootcamp = require('./models/Bootcamp')

// Connect To Database
mongoose.connect(process.env.MONGO_URI)

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// Import Into Database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data Imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log('Data Deleted!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if(process.argv[2] === '-i'){
    importData()
}

if(process.argv[2] === '-d'){
    deleteData()
}