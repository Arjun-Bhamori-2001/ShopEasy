const Product = require(`../models/product`)
const ErrorHandler = require(`../utils/errorHandler.js`)
const catchAsyncError = require(`../middlewares/catchAsyncError.js`)
const APIFeatures = require(`../utils/apiFeatures.js`)

exports.newProduct = catchAsyncError( async (req,res,next) => {

    const product = await Product.create(req.body)

    res.status(200).json({
        success : true,
        product
    })
} )

exports.getProducts =catchAsyncError(  async (req,res,next) => {

    const resPerPage = 4;
    const productCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resPerPage)
    const products = await apiFeatures.query

    res.status(200).json({
        success : true,
        count : products.lentgh,
        productCount,
        products
    })
})

exports.getSingleProduct = catchAsyncError(  async (req,res,next) => {

    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler(`Product not found.`,404))
    }

    res.status(200).json({
        success : true,
        product
    })
}) 

exports.updateSingleProduct =catchAsyncError(  async (req,res,next) => {

    let product =  await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({
            success : false,
            message : `Product not found.`
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true,
        useFindAndModify : false 
    })

    res.status(200).json({
        success : true,
        product    
    })

})

exports.deleteSingleProduct = catchAsyncError( async (req,res,next) => {

    const product =  await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({
            success : false,
            message : `Product not found.`
        })
    }

    await product.remove()

    res.status(200).json({
            success : true,
            message : `Product deleted.`
    })
})