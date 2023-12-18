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
            await this.http.put(`/configurations/${id}`, updateData);
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
        let errorMessage = this.getErrorMessage(error);

        if (errorMessage.includes("expired")) {
            errorMessage = "Your session has expired. Please sign in again.";
        } else if (
            errorMessage.includes("Fields") &&
            errorMessage.includes("invalid")
        ) {
            errorMessage =
                "A parameter key or value is invalid. Please provide valid parameters.";
        } else if (errorMessage.includes("recently updated")) {
            errorMessage =
                "This configuration has been updated recently. Please refresh and try again.";
        } else if (errorMessage.includes("not found")) {
            errorMessage =
                "This configuration was not found. Please refresh and try again.";
        } else {
            errorMessage = "Something went wrong. Please try again.";
        }

        throw new Error(errorMessage);
    }

    getErrorMessage(error) {
        if (error?.response?.data?.error) {
            return error.response.data.error;
        }
        return "";
    }
}

export const api = new API();
