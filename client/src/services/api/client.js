import axios from "axios";
import { API_BASE_URL } from "./config";
import { toApiError } from "./errors";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // If data is FormData, axios must set Content-Type with boundary automatically.
        // We explicitly remove any existing Content-Type to ensure it recalculates it.
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
        }

        return config;
    },
    (error) => Promise.reject(toApiError(error, "Failed to prepare request."))
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const message = String(error?.response?.data?.message || "").toLowerCase();
        const isUnauthorized = status === 401 || status === 403;
        const hasTokenError =
            message.includes("token") ||
            message.includes("expired") ||
            message.includes("not authorized") ||
            message.includes("jwt");

        if (isUnauthorized && hasTokenError) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("storage"));

            if (window.location.pathname !== "/login") {
                window.location.href = "/login?session=expired";
            }
        }

        return Promise.reject(toApiError(error, "No response from server."));
    }
);

export default api;

