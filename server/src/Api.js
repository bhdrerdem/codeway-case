import logger from "../lib/logger.js";
import express from "express";

export default class Api {
    constructor(service, config) {
        this.service = service;
        this.config = config;
        this.router = express.Router();
    }

    getRouter() {
        this.router.use(async (req, res, next) => {
            if (req.method == "GET") {
                await this.service.auth.verifyApiToken(req, res, next);
            } else {
                await this.service.auth.verifyIdToken(req, res, next);
            }
        });

        this.router.get("/", this.getAllConfigurations.bind(this));
        this.router.post("/", this.createConfiguration.bind(this));
        this.router.put("/:id", this.updateConfiguration.bind(this));
        this.router.delete("/:id", this.deleteConfiguration.bind(this));

        return this.router;
    }

    async getAllConfigurations(req, res) {
        try {
            const result = await this.service.firebase.getAll();
            const items = [];
            result.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            return res.status(200).send(items);
        } catch (error) {
            logger.error(error, "failed to get configurations");
            return res.status(500).send({
                error: "Failed to get configurations.",
            });
        }
    }

    async createConfiguration(req, res) {
        const { parameterKey, value, description } = req.body;

        if (!this.areInputsValid(parameterKey, value)) {
            return res.status(400).send({
                error: "Fields 'parameterKey' or 'value' invalid.",
            });
        }

        const configuration = {
            parameterKey: parameterKey,
            value: value,
            description: description || "",
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        };

        try {
            const result = await this.service.firebase.create(configuration);
            return res.status(200).send(result);
        } catch (err) {
            logger.error(
                {
                    error: err.message,
                    configuration: configuration,
                },
                "failed to create configuration"
            );
            return res.status(500).send({
                error: "Failed to create configuration.",
            });
        }
    }

    async updateConfiguration(req, res) {
        const { parameterKey, value, description } = req.body;
        const configurationId = req.params.id;

        if (!configurationId) {
            return res.status(400).send({
                error: "Missing configuration id.",
            });
        }

        if (!this.areInputsValid(parameterKey, value)) {
            return res.status(400).send({
                error: "Fields 'parameterKey' or 'value' invalid.",
            });
        }

        const updateData = {};

        updateData.parameterKey = parameterKey;
        updateData.value = value;
        updateData.description = description || "";
        updateData.updatedAt = new Date().getTime();

        try {
            const currentData = await this.service.firebase.getById(
                configurationId
            );

            if (typeof currentData.updatedAt != "number") {
                throw new Error("updatedAt field is not valid");
            }

            if (updateData.updatedAt - currentData.updatedAt < 5000) {
                return res.status(409).send({
                    error: "Configuration recently updated. Please try again later",
                });
            }

            await this.service.firebase.update(configurationId, updateData);
            return res.status(204).send();
        } catch (error) {
            logger.error(
                {
                    error: error?.message,
                    id: configurationId,
                    updateData: updateData,
                },
                "Failed to update configuration"
            );

            if (error?.code == 5) {
                return res.status(404).send({
                    error: `Configuration ${configurationId} not found.`,
                });
            }

            return res.status(500).send({
                error: "Failed to update configuration.",
            });
        }
    }

    async deleteConfiguration(req, res) {
        const configurationId = req.params.id;

        if (!configurationId) {
            return res.status(400).send({
                error: "Missing configuration id.",
            });
        }

        try {
            await this.service.firebase.getById(configurationId);

            await this.service.firebase.delete(configurationId);
            return res.status(204).send();
        } catch (error) {
            logger.error(
                { error: error?.message, id: configurationId },
                "Failed to delete configuration"
            );
            if (error?.code == 5) {
                return res.status(404).send({
                    error: `Configuration ${configurationId} not found.`,
                });
            }
            return res.status(500).send({
                error: "Failed to delete configuration.",
            });
        }
    }

    areInputsValid(parameterKey, value) {
        if (
            parameterKey == null ||
            parameterKey == undefined ||
            (typeof parameterKey === "string" && parameterKey.trim() === "")
        ) {
            return false;
        }

        if (
            value == null ||
            value == undefined ||
            (typeof parameterKey === "string" && parameterKey.trim() === "")
        ) {
            return false;
        }

        return true;
    }
}
