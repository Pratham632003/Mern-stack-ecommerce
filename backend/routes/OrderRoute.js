const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorhandler');
const catchSyncErrors = require('../utils/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const {isAuthenticatedUser , authorizeRoles} = require('../middleware/isAuthenticatedUser');
const router = express.Router();

// ROUTE 1: Create new Order
router.post('/order/new', isAuthenticatedUser , catchSyncErrors(async (req, res , next ) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        texPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        texPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Order is Placed",
        order
    })
})
)


// ROUTE 2: Get Single Order
router.get('/order/:id', isAuthenticatedUser , catchSyncErrors(async (req, res , next ) => {
    const order = await Order.findById(req.params.id).populate(
        "user", 
        "name email"
    );

    if( !order ){
        return next(new ErrorHandler(" Order not found with this id" , 404));
    }
    
    res.status(201).json({
        success: true,
        order
    })
})
)


// ROUTE 3: Get Logged in Order
router.get('/orders/me', isAuthenticatedUser , catchSyncErrors(async (req, res ) => {
    const orders = await Order.find({user: req.user._id})

    if( !orders ){
        return next(new ErrorHandler(" Order not found with this id" , 404));
    }
    
    res.status(201).json({
        success: true,
        orders
    })
})
)


// ROUTE 4: Get All Orders              ---> Admin
router.get('/admin/orders', isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors(async (req, res , next ) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })
    
    res.status(201).json({
        success: true,
        orders,
        totalAmount
    })
})
)


// ROUTE 5: Update Orders Status             ---> Admin
router.put('/admin/update/orderStatus/:id', isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors(async (req, res , next ) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order Not Found" , 404));
    }

    if(order.orderStatus == "delivered"){
        return next(new ErrorHandler("You have already delivered this order"));
    }

    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async(or) => {
            await updateStock(or.product , or.quantity);
        })
    }
    
    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave: false});

    res.status(201).json({
        success: true
    });
})
)


// ROUTE 6: Delete Order             ---> Admin
router.delete('/admin/delete/order/:id', isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors(async (req, res , next ) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order Not Found" , 404));
    }

    await order.remove();

    res.status(201).json({
        success: true,
        message: `Order with id ${req.params.id} has been deleted`
    });
})
)

async function updateStock (id , quantity){
    const product = await Product.findById(id);

    product.Stock-=quantity;

    await product.save({validateBeforeSave: false});
}

module.exports = router;