
# RecruitPro Client

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1.  Install the dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` from the sample and fill in values (in the `client/` directory):
    ```bash
    copy .env.example .env       # Windows
    # or
    cp .env.example .env         # macOS/Linux
    ```

### Environment Variables

Define these in `client/.env` (see `.env.example`):

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_BASE_URL` (Backend base URL, e.g. `http://localhost:8000`)

### Running the Application

To start the development server, run:

```bash
npm start
```

This will open the application in your browser at `http://localhost:3000`.

### Building for Production

To create a production build, run:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.
