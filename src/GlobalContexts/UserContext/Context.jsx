'use client'
import { createContext, useReducer } from "react";

import {
    USER_INITIALSTATE
} from './Constants'

import userReducer from "./Reducer";

const UserContext = createContext(USER_INITIALSTATE)
function UserProvider({ children }) {
    const [userState, userDispatch] = useReducer(userReducer, USER_INITIALSTATE)
    return (
        <UserContext.Provider value={{ userState, userDispatch }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
