#!/bin/bash

# Cloudflare Workers Deployment Script for Cisco Unity TTS

set -e

echo "🚀 Starting Cloudflare Workers deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is authenticated
if ! wrangler whoami &> /dev/null; then
    echo "🔑 Please authenticate with Cloudflare:"
    wrangler auth login
fi

# Check for required environment variables
echo "🔍 Checking environment variables..."

# Check if secrets are set
if ! wrangler secret list | grep -q "VITE_ELEVENLABS_API_KEY"; then
    echo "⚠️  VITE_ELEVENLABS_API_KEY not set."
    echo "Please set it with: wrangler secret put VITE_ELEVENLABS_API_KEY"
    exit 1
fi

if ! wrangler secret list | grep -q "BACKEND_TUNNEL_URL"; then
    echo "⚠️  BACKEND_TUNNEL_URL not set."
    echo "Please set it with: wrangler secret put BACKEND_TUNNEL_URL"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Cloudflare Workers
echo "☁️  Deploying to Cloudflare Workers..."
if [ "$1" = "dev" ]; then
    npm run deploy:dev
    echo "✅ Deployed to development environment!"
else
    npm run deploy
    echo "✅ Deployed to production!"
fi

# Show the deployed URL
echo "🌐 Your app is now live!"
echo "Check the deployment at: https://your-worker-name.your-subdomain.workers.dev"
echo ""
echo "📋 Next steps:"
echo "1. Test all functionality"
echo "2. Update your DNS settings (if using custom domain)"
echo "3. Monitor logs with: wrangler tail"

echo ""
echo "🔧 Useful commands:"
echo "  wrangler tail                    # View live logs"
echo "  wrangler secret list            # List environment variables"
echo "  wrangler secret put KEY         # Set environment variable"
echo "  wrangler secret delete KEY      # Delete environment variable"