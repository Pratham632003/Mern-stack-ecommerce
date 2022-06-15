import {
  CLEAR_ERRORS,
  CREATE_ORDER_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  MY_ORDER_REQUEST,
  MY_ORDER_FAIL,
  MY_ORDER_SUCCESS,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_FAIL,
  ALL_ORDERS_SUCCESS,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_FAIL,
  UPDATE_ORDER_SUCCESS,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_SUCCESS
} from "../constants/orderConstant";

import axios from "axios";

// Add to Cart -- Create Order
export const createOrder = (order) => async (dispatch) => {
  try {
      
    dispatch({ type: CREATE_ORDER_REQUEST });

    const config = { headers: { "Content-Type" : "application/json"}};
    const { data } = await axios.post("/api/v1/order/new" , order , config);

    dispatch({ type: CREATE_ORDER_SUCCESS , payload: data });

  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// My Orders
export const myOrders = () => async (dispatch) => {
  try{
    dispatch({ type: MY_ORDER_REQUEST });

    const { data } = await axios.get("api/v1/orders/me" );

    // console.log(" data : " , data);
    dispatch({ type: MY_ORDER_SUCCESS , payload: data.orders });

  } catch (error) {
    dispatch({
      type: MY_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get all Orders --> Admin
export const getAllOrders = () => async (dispatch) => {
  try{
    dispatch({ type: ALL_ORDERS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/orders" );

    console.log(" data : " , data);
    dispatch({ 
      type: ALL_ORDERS_SUCCESS , 
      payload: data.orders 
    });

  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Order status --> Admin
export const updateOrder = (orderId , status) => async (dispatch) => {
  try {
      
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = { headers: { "Content-Type" : "application/json"}};
    const { data } = await axios.put(`/api/v1/admin/update/orderStatus/${orderId}` , status , config);

    dispatch({ 
      type: UPDATE_ORDER_SUCCESS, 
      payload: data 
    });

  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Order status --> Admin
export const deleteOrder = (orderId) => async (dispatch) => {
  try {
      
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/delete/order/${orderId}`);

    dispatch({ 
      type: DELETE_ORDER_SUCCESS, 
      payload: data 
    });

  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Order Details
export const getOrderDetails = (id) => async (dispatch) => {
  try{
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/order/${id}`);

    dispatch({ type: ORDER_DETAILS_SUCCESS , payload: data.order });

  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
