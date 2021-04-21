const express = require(`express`)
const router = express.Router()

const {newOrder,getSingleOrder,myOrders,allOrders,deleteOrder,updateOrder} = require(`../controllers/orderController`)
const {isAuthenticatedUser,authorizeRoles} = require(`../middlewares/auth.js`)

router.route(`/order/new`).post(isAuthenticatedUser,newOrder)
router.route(`/order/:id`).get(isAuthenticatedUser,getSingleOrder)
router.route(`/order/me`).get(isAuthenticatedUser,myOrders)
router.route(`/admin/orders`).get(isAuthenticatedUser,authorizeRoles(`admin`),allOrders)
router.route(`/admin/order/:id`)
              .delete(isAuthenticatedUser,authorizeRoles(`admin`),deleteOrder)
              .put(isAuthenticatedUser,authorizeRoles(`admin`),updateOrder)

module.exports = router


