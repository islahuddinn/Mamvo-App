const Discount = require('../Models/discountModel')
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const factory = require("./handleFactory");


exports.createDiscount = catchAsync(async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(new AppError("Only an admin can add a discount",400))
    }
    const {brandName, brandLogo,discount, description, qrCode, discountUrl, isQr, isUrl} = req.body

    if(!qrCode && !discountUrl){
        return next(new AppError("Please provide either a Qr code or a discount url",400))
    }

    let newDiscount;

    if(qrCode && !discountUrl){
         newDiscount = await Discount.create({
            brandName,
            brandLogo,
            discount,
            description,
            qrCode,
            isQr: true
        })
    }else if(discountUrl && !qrCode){
        newDiscount = await Discount.create({
            brandName,
            brandLogo,
            discount,
            description,
            discountUrl,
            isUrl: true
        })
    }

    if(!newDiscount){
        return next(new AppError("Error while creating discount. Try Again!",400))
    }

    res.status(201).json({
        success: true,
        status: 200,
        message:"Discount added successfully",
        discount: newDiscount
    })
})





exports.getAllDiscounts = factory.getAll(Discount)
exports.getOneDiscount = factory.getOne(Discount)
exports.updateDiscount = factory.updateOne(Discount)
exports.deleteDiscount = factory.deleteOne(Discount)