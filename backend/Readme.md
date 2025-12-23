# Backend Service

This is the backend service for the RecruitPro application. It manages authentication, API requests, and file storage using **Firebase Admin SDK** and **Azure Blob Storage**.

---

## Tech Stack

-  Python
- Firebase Admin SDK
- Azure Blob Storage
- REST API
- Environment variables for configuration

---

## Prerequisites

Ensure you have the following installed:

- Python 3.9+
- Firebase project with Admin SDK enabled
- Azure Storage Account

---

## Environment Variables

Create a `.env` file in the `backend/` directory and configure the following:

```env
# Firebase Admin SDK
FIREBASE_CREDENTIAL_PATH=./serviceAccountKey.json
GOOGLE_API_KEY=your_google_api_key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Backend
BACKEND_BASE_URL=http://localhost:8000

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_CONTAINER_NAME=your_container_name

```

## Firebase Setup

- Open Firebase Console
- Go to Project Settings → Service Accounts
- Click "Generate new private key"
- Save the file as `serviceAccountKey.json`
- Place `serviceAccountKey.json` in the `backend/` directory

## Azure Blob Storage Setup

- Create an Azure Storage Account
- Create a Blob Container
- Copy the Storage Connection String
- Update your `.env` with:
  - `AZURE_CONTAINER_NAME=your_container_name`
  - `AZURE_STORAGE_CONNECTION_STRING=your_connection_string`


## Installation

1. Create and activate a virtual environment
   ```bash
   python -m venv venv
   # macOS/Linux
   source venv/bin/activate
   # Windows
   .\venv\Scripts\activate
   ```
2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` from the sample and fill in values
   ```bash
   copy .env.example .env       # Windows
   # or
   cp .env.example .env         # macOS/Linux
   ```
4. Ensure `serviceAccountKey.json` is present in `backend/` and the path matches `FIREBASE_CREDENTIAL_PATH`


### Running the Application

1.  Start the FastAPI development server:
    ```bash
    uvicorn main:app --reload
    ```
2.  The API will be available at `http://localhost:8000`. The UI will be served from the root `/`.

To run on a different host or port, use the `--host` and `--port` flags:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

## 📧 Contact

For any questions or feedback, please contact the development team.


