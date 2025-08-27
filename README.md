# Telegram Gemini Chatbot on Cloudflare Workers

A powerful Telegram chatbot powered by Google Gemini AI, running on Cloudflare Workers for lightning-fast responses and global availability.

## Features

- 🤖 **AI-Powered Responses**: Uses Google Gemini Pro for intelligent conversations
- ⚡ **Edge Computing**: Deployed on Cloudflare Workers for ultra-low latency
- 🌍 **Global Availability**: Responds from the nearest edge location to your users
- 🔒 **Secure**: Environment variables for API keys, no hardcoded secrets
- 💰 **Cost-Effective**: Serverless architecture with generous free tier
- 📱 **Full Telegram Integration**: Supports typing indicators and markdown formatting

## Prerequisites

Before you begin, make sure you have:

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Telegram Bot Token**: Create a bot with [@BotFather](https://t.me/botfather)
3. **Google Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **Node.js**: Version 18 or higher
5. **Wrangler CLI**: Cloudflare's development tool

## Quick Setup

### 1. Install Dependencies

```bash
npm install
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the prompts
3. Save the bot token (looks like `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)
4. Send `/setcommands` to your bot and add:
   ```
   start - Start chatting with the bot
   help - Get help information
   ```

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Save the key securely

### 5. Set Environment Variables

```bash
# Set your Telegram bot token
wrangler secret put TELEGRAM_BOT_TOKEN

# Set your Gemini API key
wrangler secret put GEMINI_API_KEY
```

### 6. Deploy to Cloudflare Workers

```bash
# Deploy to production
npm run deploy

# Or deploy to staging first
npm run deploy:staging
```

### 7. Set Up Telegram Webhook

After deployment, set up the webhook to connect Telegram to your Worker:

```bash
# Replace YOUR_BOT_TOKEN with your actual bot token
# Replace YOUR_WORKER_URL with your deployed worker URL
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://YOUR_WORKER_URL.workers.dev"}'
```

Example:
```bash
curl -X POST "https://api.telegram.org/bot123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://telegram-gemini-bot.your-subdomain.workers.dev"}'
```

## Development

### Local Development

```bash
# Start local development server
npm run dev
```

This will start a local server. For local testing with Telegram, you'll need to use a tool like ngrok to expose your local server:

```bash
# In another terminal
npx ngrok http 8787

# Then set the webhook to your ngrok URL
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-ngrok-url.ngrok.io"}'
```

### Project Structure

```
telegram-gemini-bot/
├── index.js          # Main Worker script
├── package.json      # Node.js dependencies and scripts
├── wrangler.toml     # Cloudflare Workers configuration
└── README.md         # This file
```

## Configuration

### Environment Variables

Set these using `wrangler secret put VARIABLE_NAME`:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from @BotFather
- `GEMINI_API_KEY`: Your Google Gemini API key

### Customization

You can customize the bot's behavior by modifying the `generateGeminiResponse` function in `index.js`:

- **Temperature**: Controls randomness (0.0 = deterministic, 1.0 = very random)
- **Max Tokens**: Maximum response length
- **Safety Settings**: Content filtering levels
- **System Prompt**: The bot's personality and instructions

## Deployment Options

### Production Deployment
```bash
npm run deploy:production
```

### Staging Deployment
```bash
npm run deploy:staging
```

## Monitoring and Logs

View your Worker's logs:
```bash
wrangler tail
```

Monitor your Worker in the [Cloudflare Dashboard](https://dash.cloudflare.com).

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check webhook is set correctly and Worker is deployed
2. **API errors**: Verify your API keys are set correctly with `wrangler secret list`
3. **Rate limits**: Implement rate limiting if needed for high-traffic bots

### Verify Webhook

Check if webhook is set correctly:
```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

### Delete Webhook (for testing)
```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook"
```

## Cost Optimization

Cloudflare Workers offers:
- **Free Tier**: 100,000 requests per day
- **Paid Plan**: $5/month for 10 million requests

Google Gemini offers:
- **Free Tier**: 60 requests per minute
- **Paid Plan**: $0.00025 per 1K characters

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Implement rate limiting** for production bots
4. **Monitor usage** to prevent abuse
5. **Use HTTPS** for all webhook URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your own projects!

## Support

For issues and questions:
- Check the troubleshooting section above
- Review Cloudflare Workers [documentation](https://developers.cloudflare.com/workers/)
- Check Telegram Bot API [documentation](https://core.telegram.org/bots/api)
- Review Google Gemini [documentation](https://ai.google.dev/docs)

Happy chatting! 🤖✨