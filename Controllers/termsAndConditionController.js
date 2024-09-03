const TermsOfService = require('../Models/termsOfServiceModel')
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const factory = require("./handleFactory");
const he = require('he')




exports.getOneTermsOfService = factory.getOne(TermsOfService);
exports.deleteTermsOfService = factory.deleteOne(TermsOfService);



exports.updateTermsOfService = catchAsync(async(req,res,next)=>{

  const encodedResponse = req.body.content
  const decodedResponse = he.decode(encodedResponse); // Decode the HTML entities
  req.body.content = decodedResponse

  const updatedTerms = await TermsOfService.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

  if(!updatedTerms){
      return next(new AppError("Could not update terms!", 400))
  }
  res.status(200).json({
      status:"success",
      statusCode:200,
      data:{
          updatedTerms
      }
  })

})
exports.getAllTermsOfService = catchAsync(async(req,res,next)=>{
  const terms = await TermsOfService.findOne()
  if(!terms){
      return next(new AppError("Error fetching terms",400))
  }

  res.status(200).json({
      status:"success",
      statusCode:200,
      message:"Terms fetched successfully",
      terms
  })
})

exports.createTermsOfService = catchAsync(async(req,res,next)=>{
  

  const existingTerms = await TermsOfService.find()
  if(existingTerms.length > 0){
      return next(new AppError("You cannot create new terms and conditions.Instead edit the existing terms.",400))
  }


  const encodedResponse = req.body.content
  const decodedResponse = he.decode(encodedResponse); // Decode the HTML entities
  req.body.content = decodedResponse

  const terms = await TermsOfService.create(req.body)

  if(!terms){
      return next(new AppError("Error creating new terms. Try Again!!!", 400))
  }
  res.status(201).json({
      status:"success",
      statusCode: 201,
      message:"Terms Of Service created successfully",
      terms
  })
})

