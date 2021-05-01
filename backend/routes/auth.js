const express = require('express')
const router=express.Router()

const {isAuthenticatedUser,authorizeRoles} = require(`../middlewares/auth.js`)
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,getUserProfile,
    updatePassword,
    updateProfile,
    logoutUser,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require(`../controllers/authcontroller.js`)

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route(`/password/forgot`).post(forgotPassword)
router.route(`/password/reset/:token`).put(resetPassword)
router.route(`/me`).get(isAuthenticatedUser,getUserProfile)
router.route(`/password/update`).put(isAuthenticatedUser,updatePassword)
router.route(`/me/update`).put(isAuthenticatedUser,updateProfile)
router.route(`/admin/users`).get(isAuthenticatedUser,authorizeRoles(`admin`), allUsers)
router.route(`/admin/user/:id`)
            .get(isAuthenticatedUser,authorizeRoles(`admin`),getUserDetails)
            .put(isAuthenticatedUser,authorizeRoles(`admin`), updateUser)
            .delete(isAuthenticatedUser,authorizeRoles(`admin`),deleteUser)
router.route(`/logout`).get(logoutUser)

module.exports = router