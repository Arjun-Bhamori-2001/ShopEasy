const Product = require(`../models/product`)
const ErrorHandler = require(`../utils/ErrorHandler.js`)
const catchAsyncError = require(`../middlewares/catchAsyncError.js`)
const APIFeatures = require(`../utils/apiFeatures.js`)
const cloudinary = require(`cloudinary`)

exports.newProduct = catchAsyncError( async (req,res,next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;


    const product = await Product.create(req.body)

    res.status(200).json({
        success : true,
        product
    })
} )



exports.getProducts = catchAsyncError(  async (req,res,next) => {

    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query;


    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })
    
})



exports.getAdminProducts = catchAsyncError(  async (req,res,next) => {

    const products = await Product.find()


    res.status(200).json({
        success: true,
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



    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

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


    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }


    await product.remove()

    res.status(200).json({
            success : true,
            message : `Product deleted.`
    })
})

exports.createProductReview = catchAsyncError(async (req,res,next) => {
     
    console.log("hello")
    
    const {rating,comment,productId} = req.body

    const review ={
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    
    const product = await Product.findById(productId)

    let isreviewed = false
    product.reviews.find( review =>{
         if(review.user.toString() === req.user.id.toString()){
             isreviewed = true
             review.rating = rating
            review.comment = comment
         }
    })
    
    if(!isreviewed){
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc,item) => acc+item.rating,0)/product.reviews.length

    await product.save({validateBeforeSave : false})

    res.status(200).json({
        success : true
    })

})

exports.getAllReviews = catchAsyncError( async (req,res,next) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        succes :  true,
        reviews : product.reviews
    })
})

exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    //console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})