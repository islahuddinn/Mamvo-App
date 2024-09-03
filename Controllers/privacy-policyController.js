const PrivacyPolicy = require('../Models/privacyPolicyModel')
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const factory = require("./handleFactory");
const he = require('he')




exports.getOnePrivacyPolicy = factory.getOne(PrivacyPolicy);
exports.deletePrivacyPolicy = factory.deleteOne(PrivacyPolicy);


exports.updatePrivacyPolicy = catchAsync(async(req,res,next)=>{

  const encodedResponse = req.body.content
  const decodedResponse = he.decode(encodedResponse); // Decode the HTML entities
  req.body.content = decodedResponse

  const updatedPolicy = await PrivacyPolicy.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

  if(!updatedPolicy){
      return next(new AppError("Could not update policy!", 400))
  }
  res.status(200).json({
      status:"success",
      statusCode:200,
      data:{
          updatedPolicy
      }
  })

})

exports.getAllPrivacyPolicy = catchAsync(async(req,res,next)=>{
  const policy = await PrivacyPolicy.findOne()

  if(!policy){
      return next(new AppError("Could not fetch privacy policy.",400))
  }

  res.status(200).json({
      status:"success",
      statusCode:200,
      message:"Policy fetched successfully",
      policy
  })
})


exports.createPrivacyPolicy = catchAsync(async(req,res,next)=>{
  

  const existingPolicy = await PrivacyPolicy.find()
  if(existingPolicy.length > 0){
      return next(new AppError("You cannot create new policy.Instead edit the existing policy.",400))
  }

  const encodedResponse = req.body.content
  const decodedResponse = he.decode(encodedResponse); // Decode the HTML entities
  req.body.content = decodedResponse


  const newPolicy = await PrivacyPolicy.create(req.body)

  if(!newPolicy){
      return next(new CustomError("Error creating new policy. Try Again!!!", 400))
  }
  res.status(201).json({
      status:"success",
      statusCode: 201,
      message:"Terms Of Service created successfully",
      policy: newPolicy
  })
})