const app =require(`./app.js`)
//const dotenv = require(`dotenv`)
const connectDatabase = require(`./config/database`)
const cloudinary = require(`cloudinary`)

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })



process.on(`uncaughtException`,err => {
    console.log(`Error : ${err.message}`)
    console.log(`shutting down the sver due to uncaught exception`)
    process.exit(1)
})

connectDatabase()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const server=app.listen(process.env.PORT, () => {
    console.log(`server started on port : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

process.on(`unhandledRejection`,err => {
    console.log(`Error : ${err.message}`)
    console.log(`shutting down the sver due to unhandled promise rejection`)
    server.close(() => {
        process.exit(1)
    })
})