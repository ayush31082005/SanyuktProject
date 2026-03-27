// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:5000/api",
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = "Bearer " + token;
//     }
//     return config;
// });

// export default api;



import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api/",
});

export const API_URL = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/api\/?$/, "");

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const message = String(error?.response?.data?.message || "").toLowerCase();
        const shouldLogout =
            status === 401 &&
            (message.includes("token") ||
                message.includes("not authorized") ||
                message.includes("expired") ||
                message.includes("jwt"));

        if (shouldLogout) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("storage"));

            if (window.location.pathname !== "/login") {
                window.location.href = "/login?session=expired";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
