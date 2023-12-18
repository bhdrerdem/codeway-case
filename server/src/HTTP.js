import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "../lib/logger.js";

export default class HTTP {
    constructor(service, config) {
        this.service = service;
        this.config = config;
        this.app = null;
        this.server = null;
    }

    async init() {
        const app = express();

        app.use(bodyParser.json());

        if (process.env.NODE_ENV === "production") {
            app.use(cors());
        } else {
            app.use(
                cors({
                    origin: `http://localhost:5173`,
                    credentials: true,
                })
            );
        }

        app.get("/health", async (req, res) => {
            const healthy = await this.service.isHealthy();
            return res.status(healthy ? 200 : 503).end();
        });

        app.use("/configurations", this.service.api.getRouter());

        this.app = app;
        return this;
    }

    async listen() {
        this.server = this.app.listen(this.config.port, () => {
            logger.info(`listening @ ${this.config.selfUrl}`);
        });
    }

    close() {
        this.server.close();
        this.server = null;
        this.app = null;
    }
}
