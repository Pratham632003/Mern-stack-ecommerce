const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/Ecommerce?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
// const mongoURI = "mongodb+srv://pratham:mongoPratham0987@cluster0.vm782o7.mongodb.net/Ecommerce?retryWrites=true&w=majority"
// const mongoURI = "mongodb+srv://Pratham:mongoPratham0987@cluster0.vm782o7.mongodb.net/Ecommerce?retryWrites=true&w=majority"

const connectToMongo = () =>{
    mongoose.connect(process.env.DB_URI , ()=>{
        console.log("Connect to Mongo SuccessFully")
    })
}

module.exports = connectToMongo;