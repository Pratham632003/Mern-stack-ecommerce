import axios from "axios";

import { 
    All_PRODUCT_FAIL,
    All_PRODUCT_REQUEST, 
    All_PRODUCT_SUCCESS, 
    ADMIN_PRODUCT_FAIL,
    ADMIN_PRODUCT_REQUEST, 
    ADMIN_PRODUCT_SUCCESS, 
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    ALL_REVIEW_FAIL,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    CLEAR_ERRORS
} from "../constants/productConstant"

export const getProduct = (keyword="" , currentPage=1 , price=[0,123456] , category="" , ratings=0) => async(dispatch) => {
    try{

        // This means that data is being fetching
        dispatch({
            type: All_PRODUCT_REQUEST
        });

        let link = `/api/v1/getAllProducts?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
        
        if(category){
            link = `/api/v1/getAllProducts?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}`;
        }
        
        if(ratings){
            link = `/api/v1/getAllProducts?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
        }

        const {data} = await axios.get(link);  // Fetch All Products]


        // This means than data is fetched and ready to use
        dispatch({
            type: All_PRODUCT_SUCCESS,
            payload: data,      // Payload is the naming non-official convention which is used by the 
            // developers and we can write any other word other than payload
            // This simply send some additional information from the ui to the reducer so that the reducer
            // work according to the given data and reducer can obtain this info by writing 
            // action.payload.data_name
        });

    } catch(error) {

        // This means the data is not fetched because of some errors
        dispatch({
            type: All_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getAdminProducts = () => async(dispatch) => {
    try{
        dispatch({
            type: ADMIN_PRODUCT_REQUEST
        });

        const {data} = await axios.get("/api/v1/admin/products");  // Fetch All Products]

        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data.products, 
        });

    } catch(error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload: error.response,
        })
    }
}


// New Product --> Admin
export const createProduct = (productData) => async(dispatch) => {
    try{
        dispatch({
            type: NEW_PRODUCT_REQUEST
        });

        const config = {
            headers: {"Content-Type" : "application/json"},
        }
        const {data} = await axios.post(`/api/v1/admin/create/product` , productData , config);  // Fetch All Products

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data.success,
        });

    } catch(error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Delete Product --> Admin
export const deleteProduct = (productId) => async(dispatch) => {
    try{
        dispatch({
            type: DELETE_PRODUCT_REQUEST
        });

        const {data} = await axios.delete(`/api/v1/admin/product/delete/${productId}`);  // Fetch All Products

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success,
        });

    } catch(error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Update Product --> Admin
export const updateProduct = (productId , productData) => async(dispatch) => {
    try{
        dispatch({
            type: UPDATE_PRODUCT_REQUEST
        });

        const config = {
            headers: {"Content-Type" : "application/json"},
        }
        const {data} = await axios.put(`/api/v1/admin/product/update/${productId}` , productData , config);  // Fetch All Products

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data,
        });

    } catch(error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Get the product details
export const getProductDetails = (id) => async(dispatch) => {
    try{
        dispatch({
            type: PRODUCT_DETAILS_REQUEST
        });

        const {data} = await axios.get(`/api/v1/getProductDetails/${id}`);  // Fetch All Products

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });

    } catch(error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        })
    }
}

// New Review
export const newReview = (reviewData) => async(dispatch) => {
    try{
        dispatch({
            type: NEW_REVIEW_REQUEST
        });

        const config = {
            headers: {"Content-Type" : "application/json"},
        }
        const {data} = await axios.put(`/api/v1/review` , reviewData , config);  // Fetch All Products

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success,
        });

    } catch(error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Get All Review of a product
export const getAllReviews = (productId) => async(dispatch) => {
    try{
        dispatch({
            type: ALL_REVIEW_REQUEST
        });

        const {data} = await axios.get(`/api/v1/admin/reviews?id=${productId}`);  // Fetch All Products

        console.log("reviews " , data);

        dispatch({
            type: ALL_REVIEW_SUCCESS,
            payload: data.reviews,
        });

    } catch(error) {
        dispatch({
            type: ALL_REVIEW_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Delete All Review of a product
export const deleteReviews = (productId , reviewId) => async(dispatch) => {
    try{
        dispatch({
            type: DELETE_REVIEW_REQUEST
        });

        const {data} = await axios.delete(`/api/v1/delete/review?id=${reviewId}&productId=${productId}`);  // Fetch All Products

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success,
        });

    } catch(error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Clearing Errors
export const clearErrors = () => async(dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}