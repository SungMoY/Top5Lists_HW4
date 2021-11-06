import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        console.log("useeffect called for first initialization")
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        console.log("ENTERED REDUCER")
        const { type, payload } = action;
        switch (type) {
            //changed from GET_LOGGED_IN to SET_LOGGED_IN
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                console.log("REGISTER USER SWITCH CASE")
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        console.log("getloggedin useeffect called at src/auth/index.js")
        let isErr = false;
        try {
            const response = await api.getLoggedIn();
            console.log("getLoggedIn response data: ", response.data)
        } catch (error) {
            console.log("Error in api.getLoggedIn(), Most likely bc there is no login token")
            isErr = true;
        }
        if (!isErr) {
            console.log("Valid login token exists, api.getLoggedIn() is run and gets it")
            const response = await api.getLoggedIn();
            console.log("getLoggedIn api call response:", response)
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        } else {
            console.log("No login token, api.getLoggedIn() is skipped", auth)
        }
    }
    
    auth.registerUser = async function(userData, store) {
        console.log("auth.registerUser called with", userData)
        try {
            const response = await api.registerUser(userData);
            if (response.status === 200) {
                console.log("registerUser API call went through: ", response.data.user)
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                console.log("after calling reducer", auth.user, auth.loggedIn)
                history.push("/");
                store.loadIdNamePairs();
            }
        } catch (error) {
            console.log("Register Error: ", error.response.data.errorMessage)
            //TODO, create modals for each message
        }
    }

    auth.loginUser = async function(loginData, store) {
        console.log("auth.loginData called with", loginData)
        try {
            const response = await api.loginUser(loginData)
            if (response.status === 200) {
                console.log("api.loginUser successful, returns: ", response.data.user)
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                console.log("After reducer is called: ", auth.user, auth.loggedIn)
                history.push("/");
                store.loadIdNamePairs();
            }
        } catch (error) {
            console.log("Login Error: ",error.response.data.errorMessage)
            //TODO, create modals for each message
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };