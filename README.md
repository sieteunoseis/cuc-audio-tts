# CUC Unity App

## How to use

### 1. Clone this template
```
./scripts/git-template-remote.sh https://github.com/sieteunoseis/react-express-tailwind-app.git <your-project-name>
```
### 2. Install dependencies
```
npm run install-all
```
### 3. Update environment variables and config file in frontend/public/dbSetup.json

dbSetup.json uses validations from the following library: https://www.npmjs.com/package/validator. This file is used to dynamically build the form in the app with validation. Two samples are provided, one for Cisco CUCM and one for Cisco CUC. 

Note: each entry will need corresponding env variables for the backend server. This can be set in the docker-compose.yaml file.

### 3. Run the app
```
npm run dev
```

### 4. Build the app

```
npm run build
```

### 5. Sync upstream changes from the template to your project.
```
npm run sync-remote
```

## Troubleshooting

### 1. Permission denied when running the script

```
chmod 755 ./scripts/git-template-remote.sh
```

Script based on https://www.mslinn.com/git/700-propagating-git-template-changes.html