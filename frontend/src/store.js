import {createStore , applyMiddleware, combineReducers} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewReducer, productsReducer, reviewReducer } from "./reducers/ProductReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import { cartReducer  } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer , orderDetailsReducer, orderReducer } from "./reducers/orderReducer";


// Since we have more than one reducer but the createStore in react takes only on reducer and that's why 
// we combine all the reducers to make only one reducer and then we pass the combined reducer to the store
// if we want to access the things if we only have one reducer then we can simply write state.func_name
// But in this case we have more than one reducer then suppose we have to access a func in productReducer
// Then we will write state.products.func_name
// And same for productDetails reducer state.productDetails.func_name
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    newOrder: newOrderReducer,
    cart: cartReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewReducer,
    review: reviewReducer
});


// We will provide the initial state of the products heres
let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],

        shippingInfo: localStorage.getItem("shippingInfo")
        ? JSON.parse(localStorage.getItem("shippingInfo"))
        : {},
    }
};

const middleware = [thunk];


// This is for creating store
const store = createStore(
    reducer,
    initialState,

    // This is for React-dev tools extension
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;