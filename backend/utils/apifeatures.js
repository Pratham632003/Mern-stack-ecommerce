class ApiFeatures {
    constructor(query , queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

    search() {
        const keyword = this.queryStr.keyword
        ? {
            name: {
                $regex: this.queryStr.keyword,      // If we search for samosa in samosa then Product.find({name : "samosa"}) 
                $options: "i",                      // will give the same answer but if we search samosa in samosasa then product.find
                }                                   //  will not give the ans but the regex also search for the substring
        }                                           // Option: "i" is for removing case-sensitive
        : {};
        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        // const queryCopy = this.queryStr                // This will create a reference of queryStr
        const queryCopy = {...this.queryStr}              // This will create a copy of queryStr

        //Removing some fields for category
        const removeFields = ["keyword" , "page" , "limit"];
        
        // This will remove all the filters other than category so that we can only see category which user has selected
        removeFields.forEach((key) => delete queryCopy[key]);
        
        //Filter for pricing and rating
        
        let queryStr  = JSON.stringify(queryCopy);
        
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , (key) => `$${key}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        
        return this;

        
        // this.query = this.query.find(queryCopy);       // Now queryCopy will only contain category which user has selected
        // return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
};

module.exports = ApiFeatures