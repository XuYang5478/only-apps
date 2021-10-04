//action types
const USER_LOGIN = '[User] Login';
const USER_LOGOUT = '[User] Logout';


//actions
export const userLogin = (user) => {
    localStorage.setItem("ONLYAPPS_USER", JSON.stringify(user));
    return {
        type: USER_LOGIN,
        payload: user
    };
};

export const userLogout = () => {
    localStorage.removeItem("ONLYAPPS_USER");
    window.location.replace("/");
    return {
        type: USER_LOGOUT
    }
}


//reducer
const initialState = {
    user: null
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN:
            return { user: action.payload };
        case USER_LOGOUT:
            return { user: null };
        
        default:
            return state;
    }
}
