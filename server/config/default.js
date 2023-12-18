import dotenv from "dotenv";
dotenv.config();

const envOrElse = (name, elseVal = null) => {
    const val = process.env[name];
    if (val === undefined) {
        return elseVal;
    }
    return val;
};

const intEnvOrElse = (name, elseVal = null) => {
    const val = envOrElse(name, elseVal);
    if (val === "undefined" && val !== elseVal) {
        return parseInt(val);
    } else {
        return elseVal;
    }
};

const port = intEnvOrElse("SERVER_PORT", 3001);
const url = envOrElse("SELF_URL", `http://localhost:${port}`);
const frontendUrl = envOrElse("FRONTEND_URL", "http://localhost:3000");

const config = {
    http: {
        port: port,
        selfUrl: url,
    },

    frontendUrl,

    apiToken: envOrElse("API_TOKEN", ""),

    firebase: {
        collectionId: envOrElse("FIRESTORE_COLLECTION_ID", ""),
        projectId: envOrElse("FIREBASE_PROJECT_ID", ""),
        privateKey: process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
            : "",
        clientEmail: envOrElse("FIREBASE_CLIENT_EMAIL", ""),
    },
};

export { config };
