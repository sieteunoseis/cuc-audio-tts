# Cloudflare Workers Deployment Guide

This guide explains how to deploy the Cisco Unity TTS frontend to Cloudflare Workers with backend tunnel support.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain**: A domain managed by Cloudflare (optional, can use workers.dev subdomain)
3. **Backend Tunnel**: Your existing tunnel should be accessible via HTTPS

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
# OR install locally (already included in package.json)
npm install
```

### 2. Authenticate with Cloudflare

```bash
npm run cf:login
# OR
wrangler auth login
```

### 3. Configure Your Environment

#### Update `wrangler.toml`:

1. **Change the worker name** (line 1):
   ```toml
   name = "your-app-name"
   ```

2. **Update routes** (if using custom domain):
   ```toml
   routes = [
     { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
   ]
   ```

3. **Remove routes section** if using workers.dev subdomain

#### Set Environment Variables:

```bash
# Set your ElevenLabs API key
wrangler secret put VITE_ELEVENLABS_API_KEY
# Enter your API key when prompted: sk_your_api_key_here

# Set your backend tunnel URL
wrangler secret put BACKEND_TUNNEL_URL
# Enter your tunnel URL when prompted: https://your-tunnel-url.example.com
```

### 4. Build and Deploy

```bash
# Build the application
npm run build

# Deploy to production
npm run deploy

# OR deploy to dev environment
npm run deploy:dev
```

## Environment Variables

### Required Secrets (set via wrangler secret put):
- `VITE_ELEVENLABS_API_KEY`: Your ElevenLabs API key
- `BACKEND_TUNNEL_URL`: Your backend tunnel URL (e.g., `https://tunnel.example.com`)

### Optional Variables (in wrangler.toml):
- `VITE_BRANDING_NAME`: Organization name for branding
- `VITE_BRANDING_URL`: Organization website URL

## Backend Tunnel Configuration

### Your tunnel should expose these endpoints:
- `GET /api/data` - Get connections
- `POST /api/data` - Add connection
- `PUT /api/data/select/:id` - Select connection
- `DELETE /api/data/:id` - Delete connection
- `GET /api/data/selected` - Get selected connection
- `POST /api/data/update-callhandler` - Update call handler

### Example tunnel setup:
If your backend runs on localhost:3000, your tunnel should forward:
```
https://your-tunnel-url.example.com/api/* → http://localhost:3000/api/*
```

## Testing

### Local Development:
```bash
# Test locally with Wrangler
npm run wrangler:dev
```

### Production Testing:
1. Deploy to staging first: `npm run deploy:dev`
2. Test all functionality
3. Deploy to production: `npm run deploy`

## Troubleshooting

### Common Issues:

1. **API requests fail**: Check that `BACKEND_TUNNEL_URL` is set correctly
2. **CORS errors**: The worker script handles CORS automatically
3. **Build failures**: Ensure all dependencies are installed: `npm install`
4. **Authentication issues**: Run `npm run cf:login` again

### Check deployment logs:
```bash
wrangler tail
```

### Environment variable verification:
```bash
wrangler secret list
```

## File Structure

```
frontend/
├── wrangler.toml          # Cloudflare Workers configuration
├── _worker.js             # Worker script (API proxy)
├── dist/                  # Built files (after npm run build)
├── package.json           # Updated with Wrangler scripts
└── CLOUDFLARE_DEPLOYMENT.md
```

## Security Notes

- All secrets are encrypted in Cloudflare
- CORS headers are handled automatically
- Security headers are configured in wrangler.toml
- API calls are proxied securely through the worker

## Support

For issues with:
- **Cloudflare Workers**: Check [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- **Wrangler CLI**: Check [Wrangler docs](https://developers.cloudflare.com/workers/wrangler/)
- **This application**: Check the main README.md