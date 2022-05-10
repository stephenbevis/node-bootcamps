// Imports
const express = require('express')

const router = express.Router({
    mergeParams: true
})

// Controllers
const { 
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')

// Routes
router.route('/')
    .get(getCourses)
    .post(createCourse)

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router