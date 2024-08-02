const Event = require('../Models/eventModelv2')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')
const axios = require('axios')
const factory = require('./handleFactory')




exports.getAllEvents = factory.getAll(Event)