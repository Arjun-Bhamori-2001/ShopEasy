const ErrorHandler = require(`../utils/errorHandler.js`);

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode||500
   

    if(process.env.NODE_ENV === `DEVELOPMENT`)
    {
         res.status(err.statusCode).json({
             succes : false,
             error : err,
             errMessage : err.message,
             stack : err.stack
         })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    }

    if(process.env.NODE_ENV === `PRODUCTION`)
    {
        res.status(err.statusCode).json({
            success : true,
            message : err.message||`Internal server error`
        })
    }

}