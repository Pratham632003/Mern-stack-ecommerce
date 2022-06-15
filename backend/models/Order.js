const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    shippingInfo:{
        address: {
            type:String,
            required: true
        },
        city: {
            type:String,
            required: true
        },
        state: {
            type:String,
            required: true
        },
        country: {
            type:String,
            required: true,
            default: "India"
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true,
            minlength: [10 , "Phone number should be greater than 10 digits"]
        }
    },

    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
        },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true
        },
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxprice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  });

  const Order = mongoose.model('order', OrderSchema);
  module.exports = Order;



//   {
//     "itemsPrice": 100,
//     "texPrice": 8,
//     "shippingPrice": 34,
//     "totalPrice": 230,
//     "orderItems": {
//         "name": "Samsung",
//         "price": 2300,
//         "quantity": 1,
//         "image": "Demo_image_url",
//         "product": "618fec845b240a26b1f25b96"
//     },
//     "shippingInfo": {
//         "address": "Gandhi Nagar",
//         "city": "Delhi",
//         "state": "Delhi",
//         "country": "India",
//         "pincode": 110031,
//         "phoneNo": 8743017234
//     },
//     "paymentInfo": {
//         "id": "618fec845b240a26b1f25b96",
//         "status": "Processing"
//     }
// }