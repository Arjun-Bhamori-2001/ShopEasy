const app =require(`./app.js`)
const dotenv = require(`dotenv`)
const connectDatabase = require(`./config/database`)

dotenv.config({path: `backend/config/config.env`})


process.on(`uncaughtException`,err => {
    console.log(`Error : ${err.message}`)
    console.log(`shutting down the sver due to uncaught exception`)
    process.exit(1)
})

connectDatabase()


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