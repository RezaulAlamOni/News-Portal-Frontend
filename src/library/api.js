import {baseUrl} from "./constant";
import axios from "axios";
import {getToken} from "./helper";
// api calls
export const getMethod = async (url) => {
    const token = getToken() || "";
    try {
        axios
            .get(baseUrl + url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            })
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const postMethod = async (url, data,navigate) => {
    const token = getToken() || "";
    try {
        axios
            .post(baseUrl + url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                data,
                email: data?.email,
                password: data?.password
            })
            .then(function (response) {
                localStorage.setItem("token", response?.data?.token);
                localStorage.setItem("user", response?.data?.user);
                // window.location.href = "/";
                return response?.data;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    } catch (error) {
        console.log(error);
        return error;
    }
};
export const registrationMethod = async (url, data) => {
    const token = getToken() || "";
    try {
        axios
            .post(baseUrl + url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                data,
                email: data?.email,
                password: data?.password,
                name: data?.name,
            })
            .then(function (response) {
                // localStorage.setItem("token", response?.data?.token);
                // localStorage.setItem("user", response?.data?.user);
                // window.location.href = "/";
                return response?.data;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const putMethod = async (url) => {
    const token = getToken() || "";
    try {
        axios
            .put(baseUrl + url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            })
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const deleteMethod = async (url, data) => {
    const token = getToken() || "";
    try {
        axios
            .delete(baseUrl + url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                data,
            })
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    } catch (error) {
        console.log(error);
        return error;
    }
};