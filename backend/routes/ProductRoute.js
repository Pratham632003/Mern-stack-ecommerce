const express = require('express');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorhandler');
const catchSyncErrors = require('../utils/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const {isAuthenticatedUser , authorizeRoles} = require('../middleware/isAuthenticatedUser');
const router = express.Router();
const cloudinary = require("cloudinary");

// ROUTE 1: Create a product using: POST "/api/v1/createproduct"   --> ADMIN
router.post('/admin/create/product', isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors(async (req, res ) => {

    let images = [];

    if (typeof req.body.images === "string") {
      // If only one image is present
      images.push(req.body.images);
    } else {

      // if the array of images is present
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body)

    console.log(req.body)
    res.status(200).json({
      success: true,
      product
    })
})
)


// ROUTE 2: Get All Products with search filter
router.get('/getAllProducts' , catchSyncErrors( async (req , res) => {

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query.clone();

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
})
)

// ROUTE 3: Get All Products --> Admin
router.get('/admin/products' , isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors( async (req , res) => {

  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
})
)


// ROUTE 3: Get Product Details
router.get('/getProductDetails/:id' ,  catchSyncErrors( async( req , res , next )=>{
    const product = await Product.findById(req.params.id);      // findById returns a promise

    if(!product)
      return next( new ErrorHandler("Product Not Found " , 404));

    // If Product exists
    res.status(200).json({
      success: true,
      product
    });
})
)


// ROUTE 4: Update Product                                          --> ADMIN
router.put('/admin/product/update/:id' , isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors(async( req , res , next )=>{
  
    let product = await Product.findById(req.params.id);
    if(!product)
      return next( new ErrorHandler("Product Not Found " , 500));

      // Images start here
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id , req.body , {
      new : true,
      runValidators : true,
      useFindAndModify : false
    })

    res.status(200).json({
      success: true,
      product
    })
})
)

// ROUTE 5: Delete Product                                          --> ADMIN
router.delete('/admin/product/delete/:id' , isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors(async( req , res, next )=>{
      
  const product = await Product.findById(req.params.id);
    if(!product)
      return next( new ErrorHandler("Product Not Found ! " , 404));

    // Deleting images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        
      await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      
    }

    await product.remove()

    res.status(200).json({
      success: true,
      message: "Product has been deleted"
    })
})
)


// ROUTE 6: Create New Review or Update the Review
router.put('/review' , isAuthenticatedUser  , catchSyncErrors(async( req , res, next )=>{
  
  const {rating , comment , productId} = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  }

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find( rev => (rev.user.toString() === req.user._id.toString()));
  // console.log(isReviewed)
  // console.log(review)

  if( isReviewed ){
    product.reviews.forEach((rev) => {
      if(rev.user.toString() === req.user._id.toString()){
        (rev.rating = rating) , (rev.comment = comment)
      }
    });
  }
  else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }

  let avg = 0;
  product.reviews.forEach( (rev) => {
    avg += rev.rating
  })
  product.ratings = avg/product.reviews.length;

  await product.save({ validateBeforeSave: false})

  res.status(200).json({
    success: true,
    product
  })
})
)


// ROUTE 7: Get All Reviews
router.get('/admin/reviews' , catchSyncErrors(async( req , res, next )=>{
  
  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("Product Not Found!!!" , 404));
  }
  const reviews = product.reviews;
  
  res.status(200).json({
    success: true,
    reviews
  })
})
)


// ROUTE 8: Delete Review
router.delete('/delete/review' , isAuthenticatedUser  , catchSyncErrors(async( req , res, next )=>{
  
  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHandler("Product Not Found!!!" , 404));
  }

  // Basically we add all the reviews except the one which we are going to delete in another 
  // array and then replace the new array with the previous array in the product reviews

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  )
  
  let avg = 0;

  reviews.forEach( (rev) => {
    avg += rev.rating
  })

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId ,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new : true,
      runValidators : true,
      useFindAndModify : false
    }
  )

  res.status(200).json({
    success: true
  })
})
);


module.exports = router


// The basic differnece between params and query is
// The query.id select the id after the ? (i.e., we give id as a key in thunderclient req)
// But params.id select the id in the url (i.e., just after the / )

// For ex
// http//localhost:3000/api/v1/get/product/:paramsid/and_?queryId
// http//localhost:3000/api/v1/get/product/1234/and_?5678
// In this req.params.id gives 1234
// In this req.query.id gives 5678