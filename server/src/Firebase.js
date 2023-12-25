import firebase from "firebase-admin";
import { v4 as uuid } from "uuid";
import logger from "../lib/logger.js";

export default class Firebase {
    #db = null;
    #auth = null;

    constructor(service, config) {
        this.service = service;
        this.config = config;
    }

    async init() {
        firebase.initializeApp({
            credential: firebase.credential.cert(this.config),
        });

        this.#auth = firebase.auth();
        this.#db = firebase.firestore().collection(this.config.collectionId);
    }

    async checkHealth() {
        try {
            await this.#db.doc("health").get();
            return true;
        } catch (error) {
            return false;
        }
    }

    async verifyIdToken(idToken) {
        await this.#auth.verifyIdToken(idToken);
    }

    async getAll() {
        const items = await this.#db.get();
        return items;
    }

    async create(configuration) {
        const id = uuid();

        await this.#db.doc(id).set(configuration);

        return {
            id: id,
            ...configuration,
        };
    }

    async getById(id) {
        const doc = await this.#db.doc(id).get();
        if (!doc.exists) {
            return {};
        }

        return doc.data();
    }

    async doesParameterKeyExist(parameterKey) {
        try {
            const result = await this.#db
                .where("parameterKey", "==", parameterKey)
                .get();

            if (result.empty) {
                return false;
            }

            return true;
        } catch (error) {
            logger.error(
                {
                    error: error?.message,
                    parameterKey: parameterKey,
                },
                "failed to check parameter key"
            );
            return false;
        }
    }

    async update(id, configuration) {
        await this.#db.doc(id).update(configuration);
    }

    async delete(id) {
        await this.#db.doc(id).delete();
    }
}
