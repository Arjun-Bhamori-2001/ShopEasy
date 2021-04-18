const express = require("express")
const router = express.Router()

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct
} = require("../controllers/productController")

router.route(`/products`).get(getProducts)

router.route(`/product/new`).post(newProduct)

router.route(`/product/:id`).get(getSingleProduct);

router.route(`/admin/product/:id`)
                        .put(updateSingleProduct)
                        .delete(deleteSingleProduct);

module.exports =router