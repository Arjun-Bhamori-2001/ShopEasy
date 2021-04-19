class APIFeatures {
    constructor(query,querystr) {
        this.query=query,
        this.querystr=querystr
    }

    search(){
        const keyword = this.querystr.keyword?{
            name:{
                $regex : this.querystr.keyword,
                $options : 'i'
            }
        }:{}

        this.query=this.query.find({...keyword})
        return this
    }

    filter(){
        const querycopy = {...this.querystr}
        const removeField = [`keyword`,`limit`,`page`]
        removeField.forEach(el => delete querycopy[el])

        let queryStr = JSON.stringify(querycopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
  
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    pagination(resPerPage){
        const currentPage = this.querystr.page||1
        const skip = resPerPage*(currentPage-1)

        this .query =this.query.limit(resPerPage).skip(skip)
        return this
    }

}

module.exports = APIFeatures