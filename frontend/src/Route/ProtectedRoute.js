import React , { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Redirect , Route } from "react-router-dom";


const ProtectedRoute = ({ isAdmin , component: Component , ...rest }) => {
    const { isAuthenticated , loading , user } = useSelector(state => state.user)
    return (
        <Fragment>
            {loading===false && (
                <Route
                    {...rest}
                    render = {(props) => {
                        if(isAuthenticated === false) {
                            return <Redirect to = "/login" />;
                        }
                        
                        // This condition only works when we pass isAdmin true from the App.js
                        // As the conditon contains And operator so that's why it works only when 
                        // the isAdmin is true otherwise the isAdmin is false
                        if(isAdmin === true && user.role !== "admin"){
                            return <Redirect to = "/login" />;
                        }

                        return <Component {...props} />;
                    }}
                />
            )}
        </Fragment>  
    );
}

export default ProtectedRoute
