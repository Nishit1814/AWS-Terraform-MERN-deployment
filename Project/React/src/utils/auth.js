
const TOKEN_KEY = "token";

export const setAuth = (token) => {
    if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
};
// Get token (used in axios interceptor / API calls)
export const getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY) || null;
};

// Check if user is logged in
export const isAuthenticated = () => {
    return !!sessionStorage.getItem(TOKEN_KEY);
};

// Clear token on logout — alias kept for backward compatibility
export const clearAuth = () => {
    sessionStorage.removeItem(TOKEN_KEY);
};

// Same as clearAuth — used in authService.js logout()
export const removeAuth = () => {
    sessionStorage.removeItem(TOKEN_KEY);
};
