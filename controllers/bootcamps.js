// Imports
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// Model
const Bootcamp = require('../models/Bootcamp')

// @desc     Get All Bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields To Exlude
    const removeFields = ['select']

    // Loop Through removeFields And Delete From reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create Query String
    let queryStr = JSON.stringify(reqQuery)

    // Create Operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Find Resource
    let query = Bootcamp.find(JSON.parse(queryStr))

    // Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // Sort Query Results
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Execute Query
    const bootcamps = await query

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

// @desc     Get Single Bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc     Create Bootcamp
// @route    POST /api/v1/bootcamps/
// @access   Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

// @desc     Update Bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc     Delete Bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(204).json({
        success: true,
        data: {}
    })
})

// @desc     Get Bootcamps Within A Radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get Lat/Lng From Geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calculate Radius Using Radians
    // Divide Distance By Radius Of Earth
    // Earth Radius: 3,963 Miles / 6,378 Kilometers
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { 
            $geoWithin: { 
                $centerSphere: [ 
                    [lng, lat], 
                    radius 
                ] 
            }
        }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})