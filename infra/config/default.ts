import * as dotenv from "dotenv";
dotenv.config();

const envOrElse = (name: string, elseVal: string): string => {
    const val = process.env[name];
    return val ?? elseVal;
};

const intEnvOrElse = (name: string, elseVal: number): number => {
    const val = envOrElse(name, elseVal.toString());
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? elseVal : parsed;
};

export interface CodewayConfig {
    backendPort: number;
    apiToken: string;
    firestoreCollectionId: string;
    firebaseProjectId: string;
    firebasePrivateKey: string;
    firebaseClientEmail: string;
    frontendImageUrl: string;
    backendImageUrl: string;
}

export const config: CodewayConfig = {
    backendPort: intEnvOrElse("SERVER_PORT", 3001),
    apiToken: envOrElse("API_TOKEN", ""),
    firestoreCollectionId: envOrElse("FIRESTORE_COLLECTION_ID", ""),
    firebaseProjectId: envOrElse("FIREBASE_PROJECT_ID", ""),
    firebasePrivateKey: envOrElse("FIREBASE_PRIVATE_KEY", ""),
    firebaseClientEmail: envOrElse("FIREBASE_CLIENT_EMAIL", ""),
    frontendImageUrl: envOrElse("FRONTEND_IMAGE_URL", ""),
    backendImageUrl: envOrElse("BACKEND_IMAGE_URL", ""),
};
