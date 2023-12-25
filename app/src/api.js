import axios from "axios";

class API {
    constructor() {
        console.log(import.meta.env);
        this.http = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL,
        });

        this.apiToken = import.meta.env.VITE_API_TOKEN;
        this.idToken = "";

        this.http.interceptors.request.use(
            (config) => {
                const token =
                    config.method === "get" ? this.apiToken : this.idToken;

                if (token) {
                    config.headers.Authorization = token;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    setIdToken(token) {
        this.idToken = token;
    }

    async fetchAllConfigs() {
        try {
            const response = await this.http.get("/configurations");
            return response.data;
        } catch (error) {
            console.error(error);
            this.handleError(error);
        }
    }

    async createConfig(data) {
        try {
            const response = await this.http.post("/configurations", data);
            return response.data;
        } catch (error) {
            console.error(error);
            this.handleError(error);
        }
    }

    async updateConfig(id, updateData) {
        try {
            const response = await this.http.put(
                `/configurations/${id}`,
                updateData
            );
            return response.data;
        } catch (error) {
            console.error(error);
            this.handleError(error);
        }
    }

    async deleteConfig(id) {
        try {
            await this.http.delete(`/configurations/${id}`);
        } catch (error) {
            console.error(error);
            this.handleError(error);
        }
    }

    handleError(error) {
        let err = this.getError(error);

        if (err.message.includes("expired")) {
            err.message = "Your session has expired. Please sign in again.";
        } else if (
            err.message.includes("Fields") &&
            err.message.includes("invalid")
        ) {
            err.message =
                "A parameter key or value is invalid. Please provide valid parameters.";
        } else if (err.message.includes("recently updated")) {
            err.message =
                "This configuration has been updated recently. Please refresh and try again.";
        } else if (err.message.includes("not found")) {
            err.message =
                "This configuration was not found. Please refresh and try again.";
        } else {
            err.message = "Something went wrong. Please try again.";
        }

        throw err;
    }

    getError(error) {
        return {
            code: error?.response?.status || 500,
            message: error?.response?.data?.error || "",
        };
    }
}

export const api = new API();
