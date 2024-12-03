# CUC Unity App

## How to use

### 1. Clone the repository
### 2. Install dependencies
```
npm run install-all
```
### 3. Update environment variables or config file in frontend/public/dbSetup.json

Uses validations from the following library: https://www.npmjs.com/package/validator

Two samples are provided. Not each entry will need a corresponding env for the backend server.

### 3. Run the app
```
npm run dev
```

```
docker-compose up --build
```