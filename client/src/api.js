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
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log(`API [${config.method.toUpperCase()}] ${config.url} - Token found:`, !!token);
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    } else {
        console.warn(`API [${config.method.toUpperCase()}] ${config.url} - NO TOKEN ATTACHED`);
    }
    return config;
});

export default api;