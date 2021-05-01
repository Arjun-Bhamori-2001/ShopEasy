const express = require(`express`)
const products = require(`./routes/products.js`)
const auth = require(`./routes/auth.js`)
const order = require(`./routes/order.js`)
const app=express()

const path = require('path')

//const dotenv = require(`dotenv`)
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })



const cookieParser =  require(`cookie-parser`)
const bodyParser = require(`body-parser`)
const fileUpload = require(`express-fileupload`)
const payment = require(`./routes/payment`)


const errorMiddleware = require(`./middlewares/error.js`)


app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())
app.use(fileUpload())



app.use(`/api/v1`,products)
app.use(`/api/v1`,auth)
app.use(`/api/v1`,order)
app.use(`/api/v1/`,payment)



if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}





app.use(errorMiddleware)




module.exports = app