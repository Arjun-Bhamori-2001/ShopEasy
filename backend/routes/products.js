const express = require("express")
const router = express.Router()

const {isAuthenticatedUser,authorizeRoles}= require(`../middlewares/auth`)

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
    createProductReview,
    getAllReviews,
    getAdminProducts,
    deleteReview 
} = require("../controllers/productController")

router.route(`/products`).get(getProducts)

router.route(`/product/:id`).get(getSingleProduct)

router.route(`/admin/product/new`).post(isAuthenticatedUser,authorizeRoles(`admin`),newProduct)

router.route(`/admin/products`).get(isAuthenticatedUser,authorizeRoles(`admin`),getAdminProducts)

router.route(`/admin/product/:id`)
                        .put(isAuthenticatedUser,authorizeRoles(`admin`),updateSingleProduct)
                        .delete(isAuthenticatedUser,authorizeRoles(`admin`),deleteSingleProduct);

router.route(`/review`).put(isAuthenticatedUser,createProductReview)
router.route(`/reviews`)
              .get(isAuthenticatedUser,getAllReviews)
              .delete(isAuthenticatedUser,deleteReview)


module.exports =router