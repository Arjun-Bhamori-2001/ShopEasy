const products = require(`../data/products.js`)
const Product = require(`../models/product.js`)

const connectDatabase = require(`../config/database.js`)
const {connect} = require(`mongoose`)

const dotenv = require(`dotenv`)
dotenv.config({path:`backend/config/config.env`})

connectDatabase()

const seedProducts = async () => {
    try{
        await Product.deleteMany();
        console.log("Delete all the producs from database");
        await Product.insertMany(products);
        console.log("All the the products added to database");
        process.exit();
    }catch(error){
        console.log(error);
        process.exit();
    }
}

seedProducts()

