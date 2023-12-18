import express from "express";
import logger from "../lib/logger.js";

export default class Auth {
    constructor(service, config) {
        this.service = service;
        this.config = config;
        this.router = express.Router();
    }

    async init() {
        if (this.config.apiToken == "") {
            throw new Error("api token is empty");
        }
    }

    async verifyIdToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send("No token provided");
        }

        try {
            await this.service.firebase.verifyIdToken(token);
            next();
        } catch (err) {
            let errorMessage = "Invalid token";
            if (err.code && err.code == "auth/id-token-expired") {
                errorMessage = "Token has expired";
            }

            return res.status(401).send({
                error: errorMessage,
            });
        }
    }

    async verifyApiToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send("No token provided");
        }

        if (token != this.config.apiToken) {
            return res.status(401).send("Invalid token");
        }

        next();
    }
}
