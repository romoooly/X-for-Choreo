# 🚀 Quick Start Guide

Get your Gemini Telegram bot running in 5 minutes!

## ⚡ Super Quick Setup

### 1. Get Your API Keys

- **Gemini API Key**: [Get it here](https://makersuite.google.com/app/apikey)
- **Telegram Bot Token**: Message [@BotFather](https://t.me/botfather) and send `/newbot`

### 2. Configure Your Bot

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual keys
nano .env
```

Fill in your `.env` file:
```bash
GEMINI_API_KEY=your-actual-gemini-key
TELEGRAM_BOT_TOKEN=your-actual-bot-token
DEBUG=false
```

### 3. Deploy with One Command

```bash
# Run the deployment script
./deploy.sh
```

**That's it!** 🎉

## 🔧 Manual Setup (Alternative)

If you prefer to do it step by step:

```bash
# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Deploy
npx wrangler deploy
```

## 📱 Test Your Bot

1. **Visit your worker**: `https://your-worker.your-subdomain.workers.dev`
2. **Set up webhook**: Visit `/setup-webhook` endpoint
3. **Message your bot** on Telegram with `/start`

## 🆘 Need Help?

- **Check logs**: `npx wrangler tail`
- **Debug mode**: Set `DEBUG=true` in `.env`
- **Health check**: Visit `/health` endpoint

## 📚 Full Documentation

See [README.md](README.md) for complete details and customization options.