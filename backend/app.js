const express = require(`express`)
const products = require(`./routes/products.js`)
const app=express()
const errorMiddleware = require(`./middlewares/error.js`)

app.use(express.json());

app.use(`/api/v1`,products)

app.use(errorMiddleware)




module.exports = app