const express = require("express")
const router = express.Router()

const {isAuthenticatedUser,authorizeRoles}= require(`../middlewares/auth`)

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct
} = require("../controllers/productController")

router.route(`/products`).get(getProducts)

router.route(`/product/:id`).get(getSingleProduct)

router.route(`/admin/product/new`).post(isAuthenticatedUser,authorizeRoles(`user`),newProduct)

router.route(`/admin/product/:id`)
                        .put(isAuthenticatedUser,authorizeRoles(`admin`),updateSingleProduct)
                        .delete(isAuthenticatedUser,authorizeRoles(`admin`),deleteSingleProduct);

module.exports =router