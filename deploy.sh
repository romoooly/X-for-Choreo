#!/bin/bash

# Gemini Telegram Bot - Deployment Script
# This script helps you deploy your bot to Cloudflare Workers

set -e

echo "🚀 Gemini Telegram Bot - Deployment Script"
echo "=========================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Installing now..."
    npm install -g wrangler
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please log in to Cloudflare..."
    wrangler login
fi

# Check if environment variables are set
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Please create one with your API keys:"
    echo "   Copy .env.example to .env and fill in your values"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your-gemini-api-key-here" ]; then
    echo "❌ Please set GEMINI_API_KEY in your .env file"
    exit 1
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ "$TELEGRAM_BOT_TOKEN" = "your-telegram-bot-token-here" ]; then
    echo "❌ Please set TELEGRAM_BOT_TOKEN in your .env file"
    exit 1
fi

echo "✅ Environment variables configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Cloudflare Workers
echo "🚀 Deploying to Cloudflare Workers..."
wrangler deploy

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📋 Next steps:"
echo "1. Visit your worker URL to verify it's running"
echo "2. Set up the Telegram webhook by visiting:"
echo "   https://your-worker.your-subdomain.workers.dev/setup-webhook"
echo "3. Test your bot on Telegram!"
echo ""
echo "🔗 Useful endpoints:"
echo "   • Health check: /health"
echo "   • Webhook setup: /setup-webhook"
echo "   • Main webhook: /webhook"
echo ""
echo "📚 For more information, check the README.md file"