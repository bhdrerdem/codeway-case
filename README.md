# Codeway Case

## Description

This app is designed for managing application configurations. Users can list, update, delete, or create configurations.

## Getting Started

### Dependencies

-   Node.js (v20.9.0)
-   Firebase Project

### Creating a Firebase Project

Before you can use this application, you need to create a Firebase project. Follow these steps to create a Firebase project:

1. **Visit the Firebase Console:**

    - Go to the [Firebase Console](https://console.firebase.google.com/).

2. **Create a New Project:**

    - Click on "Add Project" to create a new Firebase project.
    - Give your project a name (e.g., "Codeway Case") and click "Next."

3. **Add an App to Your Project:**

    - Once your project is created, click on "Add App" to add a web app to your Firebase project.
    - Choose a nickname for your app (e.g., "Codeway Case Web").

4. **Get Firebase Configuration Details:**

    - After adding the app, Firebase will provide you with configuration details. These include:

        - `apiKey`
        - `authDomain`
        - `projectId`
        - `storageBucket`
        - `messagingSenderId`
        - `appId`

    - Keep these details handy to use firebase in client side.

### Adding Authentication to Your Firebase Project

To enable Firebase Authentication for your project and allow users to sign in using email and password, follow these steps:

1. **In the Firebase Console:**

    - In the Firebase Console, select your project

2. **Navigate to Authentication:**

    - In the left sidebar, click on "Authentication." under "Build".

3. **Get Started with Authentication:**

    - Click on "Get Started" to set up authentication for your project.

4. **Enable Email and Password Authentication:**

    - Click on "Email/Password" section in Sign-in Providers tab.
    - Enable "Email/Password" toggle only.
    - Click "Save".

5. **Users**

    - You can add user to login to your app under "Users" tab.

### Creating a Firestore Database

To store and manage data for this app, you need to create a Firestore database in Firebase. Follow these steps to create a Firestore database:

1. **Navigate to Firestore Database:**

    - In the left sidebar under "Build" tab, click on "Firestore Database"

2. **Create Database:**

    - Click the "Create database" button to start the Firestore setup process.

3. **Name and Location:**

    - Give your Firestore database a name.
    - Choose the desired location for your database.

4. **Add collection**
    - Click on "Start collection"
    - Give you collection a name which you will use in your app.

### Obtaining Firebase Admin Private Key

To use Firebase Admin SDK in your Node.js backend, you need to obtain admin details for Firebase Admin. Follow these steps to access and download the admin detail:

1. **Navigate to Project Settings:**

    - Click on "Project settings" in the gear icon (settings) next to "Project Overview" on the left sidebar to access your project settings.

2. **Service accounts:**

    - In the Project settings, navigate to the "Service accounts" tab.

3. **Generate New Private Key:**

    - Under "Firebase Admin SDK," you should see a section labeled "Firebase Admin SDK." There, you'll find a button labeled "Generate new private key." Click on it.

4. **Download JSON Key File:**
    - A popup will appear, and you'll be prompted to generate a new private key. Click the "Generate key" button.
    - This will download a JSON key file to your computer. This JSON file contains the private key, client email, and other important credentials.
    - Keep handy, you will need to use these credentials in the app.

### Environment Variables

To use this application, pass the following environment variables for both the backend and frontend:

**Backend Environment Variables:**

-   `SERVER_PORT`: The port on which the backend server should run (e.g., 3001).
-   `API_TOKEN`: An API token for authentication purposes.
-   `FIRESTORE_COLLECTION_ID`: The Firestore collection ID where configurations are stored.
-   `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
-   `FIREBASE_PRIVATE_KEY`: Your Firebase Private Key. Note that this key should be enclosed in double quotes.
-   `FIREBASE_CLIENT_EMAIL`: Your Firebase Client Email.

**Frontend Environment Variables:**

-   `VITE_API_TOKEN`: The same API token that is needed for both the frontend and the backend.
-   `VITE_BACKEND_URL`: The URL of the backend API
-   `VITE_FIREBASE_API_KEY`: Your Firebase API Key.
-   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Authentication Domain.
-   `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID.
-   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket.
-   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID.
-   `VITE_FIREBASE_APP_ID`: Your Firebase App ID.

These environment variables are required for both local and production usage. Ensure you pass these variables when running the application.

### Running the Application

Follow these steps to run the app:

1. **Install Dependencies:**

    - Install the required dependencies for the frontend and backend:

        ```bash
        cd app
        npm install

        cd ../server
        npm install
        ```

2. **Running the Application:**

    - Start the frontend and backend separately using the following commands:

        ```bash
        npm run dev #frontend
        ```

        ```bash
        npm run start #backend
        ```

### Deployment

To deploy the app to AWS ECS using AWS CDK, follow these steps:

1. **Build the Docker Images:**

    - Build the Docker image for the frontend, passing all the required environment variables as build arguments:

        ```bash
        docker build -t codeway-case-frontend \
          --build-arg VITE_API_TOKEN=your-api-token \
          --build-arg VITE_BACKEND_URL=your-backend-url \
          --build-arg VITE_FIREBASE_API_KEY=your-firebase-api-key \
          --build-arg VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain \
          --build-arg VITE_FIREBASE_PROJECT_ID=your-firebase-project-id \
          --build-arg VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket \
          --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id \
          --build-arg VITE_FIREBASE_APP_ID=your-firebase-app-id \
          ./app

        # Build the backend Docker image
        docker build -t codeway-case-backend ./server
        ```

    Replace `your-api-token`, `your-backend-url`, and the Firebase configuration variables (`your-firebase-...`) with the actual values you want to use during the frontend build.

2. **Push the Docker Images to a Container Registry:**

    - Push the Docker images for both the frontend and backend to a container registry (e.g., Amazon ECR) to make them available for deployment.

3. **Deploy Using AWS CDK:**

    - Deploy the Codeway Case application using AWS CDK. Make sure that pass all backend environment variable into the AWS CDK infrastructure environment variables before deployment for security and configuration.

    - Navigate to the `/infra` directory:

        ```bash.
        cd infra
        ```

    - Deploy the Codeway Case application using AWS CDK:

        ```bash
        cdk deploy
        ```
