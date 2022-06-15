import {
    ADD_TO_CART, REMOVE_CART_ITEM , SAVE_SHIPPING_INFO
  } from "../constants/cartConstant";
  import axios from "axios";
  
  // Add to Cart
  export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    
    const { data } = await axios.get(`/api/v1/getProductDetails/${id}`);
  
    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.Stock,
        quantity,
      },
    });
    
    // Since if we add the products to the cart then after reloading the cart becomes empty so because of
    // this we have to store the cart to the loacal storage so that cart does not become null after reloading
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };

  // REMOVE FROM CART
  export const removeItemFromCart = (id) => async (dispatch, getState) => {
  
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };
  

  // SAVE SHIPPING INFO
  export const saveShippingInfo = (data) => async (dispatch, getState) => {
  
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };
  
