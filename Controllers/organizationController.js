const Organization = require('../Models/organizationModel')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')
const factory = require('../Controllers/handleFactory')




exports.getAllOrganizations = factory.getAll(Organization)