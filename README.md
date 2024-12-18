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
| VITE_ELEVENLABS_API_KEY | Authentication key for ElevenLabs API integration. See https://elevenlabs.io/app/settings/api-keys | `sk_73e46...62c1` | `yes` | 
| VITE_BRANDING_NAME | Organization name for branding purposes in NavBar | `Automate Builders` | `no` | 
| VITE_BRANDING_URL | URL for organization branding/website in NavBar | `http://automate.builders` | `no` |
| LANGUAGE | Cisco Unity Locale to save the greeting to | `1033` | `no` |
| UID | User ID | `1000` | `no` |
| GID | Group ID | `1000` | `no` |

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
# Create directories if they don't exist
mkdir -p ./data ./db

# Set permissions (replace 1000:1000 with your actual UID:GID if different)
chown -R 1000:1000 ./data ./db
chmod 755 ./data ./db
```
Add the following line to the docker-compose.yml file for the backend service.
``` 
user: "${UID:-1000}:${GID:-1000}"
volumes:
  - ./data:/usr/src/app/data
  - ./db:/usr/src/app/db
```
Note: that the data directory will be used to store the audio files and the db directory will be used to store the sqlite database.

## Screenshots

![Home](https://raw.githubusercontent.com/sieteunoseis/cuc-audio-tts/746ee13d0b57928009e407a558643108c46f5c8c/screenshots/home.png)

![Connections](https://raw.githubusercontent.com/sieteunoseis/cuc-audio-tts/6660ec08598e901979a7355f3ade51cea61b3a2b/screenshots/connections.png)

## Troubleshooting

Frontend container is not able to reach backend container.

Try pinging from frontend to backend container:

```
docker exec unity-tts-frontend ping unity-tts-backend
```

Backend container is not able to save the audio files or database.

```
docker exec unity-tts-backend ls -l /usr/src/app/data
```

Try to create a file in the data directory and check the permissions.

```
docker exec unity-tts-backend touch /usr/src/app/data/test.txt
```

## Giving Back

If you would like to support my work and the time I put in creating the code, you can click the image below to get me a coffee. I would really appreciate it (but is not required).

<a href="https://www.buymeacoffee.com/automatebldrs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
