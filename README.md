# Cisco Unity Greetings TTS App

This is a web application that allows users to generate text-to-speech (TTS) audio files for Cisco Unity Connection (CUC) CallHandler greetings. The app uses the ElevenLabs API to generate the audio files and provides a simple interface for users to enter the desired text and upload the resulting audio file. The app also includes an option to create a new CallHandler in CUC and upload the audio file directly to the CallHandler.

## How to use

### Development Mode

#### 1. Clone this template
```
git clone https://github.com/sieteunoseis/cuc-audio-tts.git
```
#### 2. Install dependencies
```
npm run install-all
```

#### 3. Run the app
```
npm run dev
```

#### 4. Build the app

```
npm run build
```

#### 5. Deploy the app to a server

### Production Mode

#### 1. Download docker-compose.yml file from this repository
```
wget -O docker-compose.yaml https://raw.githubusercontent.com/sieteunoseis/cuc-audio-tts/refs/heads/master/docker-compose.yaml
```
#### 2. Create a .env file with the following content
```
touch .env
```

| Variable Name | Explanation | Example/Default | Required |
|--------------|-------------|----------------|----------------|
| VITE_BACKEND_PORT | Port number for the backend server in Vite applications | `5001` | `no` |                
| VITE_ELEVENLABS_API_KEY | Authentication key for ElevenLabs API integration. See https://elevenlabs.io/app/settings/api-keys | `sk_73e46...62c1` | `yes` | 
| VITE_BRANDING_NAME | Organization name for branding purposes in NavBar | `Automate Builders` | `no` | 
| VITE_BRANDING_URL | URL for organization branding/website in NavBar | `http://automate.builders` | `no` | 
| VITE_TABLE_COLUMNS | Comma-separated list of column names for table display | `name,hostname,username,password` | `no` | 
| LANGUAGE | Cisco Unity Locale to save the greeting to | `1033` | `no` | 

#### 3. Run the app
```
docker-compose up -d
```
#### 4. Access the app
```
http://localhost:3000
```

#### 5. Optionally add local volume to persist data
```
mkdir /data
mkdir /db
```
Add the following line to the docker-compose.yml file for the backend service.
``` 
volumes:
  - ./data:/usr/src/app/data
  - ./db:/usr/src/app/db
```
Note that the data directory will be used to store the audio files and the db directory will be used to store the sqlite database.

## Screenshots

![Home](https://raw.githubusercontent.com/sieteunoseis/cuc-audio-tts/6660ec08598e901979a7355f3ade51cea61b3a2b/screenshots/home.png)

![Connections](https://raw.githubusercontent.com/sieteunoseis/cuc-audio-tts/6660ec08598e901979a7355f3ade51cea61b3a2b/screenshots/connections.png)

## Troubleshooting

Docker can't resolve the hostname you're using for the backend service.

Try pinging from frontend to backend container:

```
docker exec unity-tts-frontend ping unity-tts-backend
```

## Giving Back

If you would like to support my work and the time I put in creating the code, you can click the image below to get me a coffee. I would really appreciate it (but is not required).

<a href="https://www.buymeacoffee.com/automatebldrs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
