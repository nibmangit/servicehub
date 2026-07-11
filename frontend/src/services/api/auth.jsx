import api from "./axios";

export const registerUser = (data) => {
    return api.post("/auth/register/", data);
};

export const loginUser = (data) => {
    return api.post("/auth/login/", data);
};

export const refreshToken = (refresh) => {
    return api.post("/auth/refresh/", {
        refresh,
    });
};

export const getProfile = () => {
    return api.get("/profiles/me/");
};

export const updateProfile = (data) => {
    return api.put("/profiles/me/", data);
};

export const becomeProvider = (data) => {
    return api.post("/profiles/become-provider/", data);
};