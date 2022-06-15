import axios from "axios";

import { 
    LOGIN_FAIL,
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    ALL_USER_REQUEST,
    ALL_USER_SUCCESS,
    ALL_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    CLEAR_ERRORS
} from "../constants/userConstant"


// LOGIN
export const login = (email , password) => async(dispatch) => {
    try{
        dispatch({
            type: LOGIN_REQUEST
        });

        let link = `/api/v1/login`;
        const config = { headers: { "Content-Type" : "application/json"}};

        const {data} = await axios.post(link , {email , password} , config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user, 
        });

    } catch(error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message,
        })
    }
}


// REGISTER
export const register = (userData) => async(dispatch) => {
    try{
        dispatch({
            type: REGISTER_USER_REQUEST
        });

        let link = `/api/v1/register`;
        const config = { headers: { "Content-Type" : "multipart/form-data"}};

        const {data} = await axios.post(link , userData , config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user, 
        });

    } catch(error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Load User
export const loadUser = () => async (dispatch) => {
    try {
      dispatch({ type: LOAD_USER_REQUEST });
  
      const { data } = await axios.get(`/api/v1/me`);
  
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
    }
  };
  


// // LOAD USER
// export const loadUser = () => async(dispatch) => {
//     try{
//         dispatch({
//             type: LOAD_USER_REQUEST
//         });

//         const {data} = await axios.get("/api/v1/me");
//         console.log("data is : " , data)

//         dispatch({
//             type: LOAD_USER_SUCCESS,
//             payload: data.user,
//         });

//     } catch(error) {
//         dispatch({
//             type: LOAD_USER_FAIL,
//             payload: error.response,
//         })
//     }
// }


// Get All USER
export const getAllUsers = () => async(dispatch) => {
    try{
        dispatch({
            type: ALL_USER_REQUEST
        });

        const {data} = await axios.get("/api/v1/admin/get/users");
        console.log(data);

        dispatch({
            type: ALL_USER_SUCCESS,
            payload: data.users,
        });

    } catch(error) {
        dispatch({
            type: ALL_USER_FAIL,
            payload: error.response.data.message,
        })
    }
}


// Get User Details
export const getUserDetails = (userId) => async(dispatch) => {
    try{
        dispatch({
            type: USER_DETAILS_REQUEST
        });

        const {data} = await axios.get(`/api/v1/admin/get/user/${userId}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });

    } catch(error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message,
        })
    }
}



// UPDATE Any USER
export const updateUser = (id , userData) => async(dispatch) => {
    try{
        dispatch({
            type: UPDATE_USER_REQUEST
        });

        let link = `/api/v1/admin/update/${id}`;
        const config = { headers: { "Content-Type" : "multipart/form-data"}};

        const {data} = await axios.put(link , userData , config);

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success, 
        });

    } catch(error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message,
        })
    }
}




// Delete Any USER
export const deleteUser = (id ) => async(dispatch) => {
    try{
        dispatch({
            type: DELETE_USER_REQUEST
        });

        let link = `/api/v1/admin/delete/${id}`;

        const {data} = await axios.delete(link);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data, 
        });

    } catch(error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        })
    }
}



// LOGOUT USER
export const logout = () => async(dispatch) => {
    try{
        let link = `/api/v1/logout`;

        await axios.get(link);

        dispatch({
            type: LOGOUT_SUCCESS,
        });

    } catch(error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message,
        })
    }
}



// UPDATE USER
export const updateProfile = (userData) => async(dispatch) => {
    try{
        dispatch({
            type: UPDATE_PROFILE_REQUEST
        });

        let link = `/api/v1/update/profile`;
        const config = { headers: { "Content-Type" : "multipart/form-data"}};

        const {data} = await axios.put(link , userData , config);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success, 
        });

    } catch(error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message,
        })
    }
}



// UPDATE PASSWORD
export const updatePassword = (userData) => async(dispatch) => {
    try{
        dispatch({
            type: UPDATE_PASSWORD_REQUEST
        });

        let link = `/api/v1/password/update`;
        const config = { headers: { "Content-Type" : "application/json"}};

        const {data} = await axios.put(link , userData , config);

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success, 
        });

    } catch(error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message,
        })
    }
}



// FORGOT PASSWORD
export const forgotPassword = (email) => async(dispatch) => {
    try{
        dispatch({
            type: FORGOT_PASSWORD_REQUEST
        });

        let link = `/api/v1/forgotpassword`;
        const config = { headers: { "Content-Type" : "application/json"}};

        const {data} = await axios.post(link , email , config);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message, 
        });

    } catch(error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message,
        })
    }
}

// RESET PASSWORD
export const resetPassword = (token , passwords) => async(dispatch) => {
    try{
        dispatch({
            type: RESET_PASSWORD_REQUEST
        });

        let link = `/api/v1/password/reset/${token}`;
        const config = { headers: { "Content-Type" : "application/json"}};

        const {data} = await axios.put(link , passwords , config);

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success, 
        });

    } catch(error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response.data.message,
        })
    }
}


// Clearing Errors
export const clearErrors = () => async(dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}