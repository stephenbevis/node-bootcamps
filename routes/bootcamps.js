// Imports
const express = require('express')

// Other Resource Routers
const courseRouter = require('./courses')

const router = express.Router()

// Controllers
const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps')

// Re-Route Into Other Resource Routers
router.use('/:bootcampId/courses', courseRouter)

// Routes
router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

module.exports = router