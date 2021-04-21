const express = require(`express`)
const products = require(`./routes/products.js`)
const auth = require(`./routes/auth.js`)
const order = require(`./routes/order.js`)
const app=express()
const errorMiddleware = require(`./middlewares/error.js`)
const cookieParser =  require(`cookie-parser`)

app.use(express.json())
app.use(cookieParser())

app.use(`/api/v1`,products)
app.use(`/api/v1`,auth)
app.use(`/api/v1`,order)

app.use(errorMiddleware)




module.exports = app