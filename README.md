# Gemini Chatbot for Telegram - Cloudflare Workers

A powerful AI chatbot that integrates Google's Gemini AI with Telegram, built on Cloudflare Workers for high performance and global reach.

## Features

- 🤖 **AI-Powered Responses**: Uses Google's Gemini Pro model for intelligent conversations
- 📱 **Telegram Integration**: Seamless integration with Telegram Bot API
- ⚡ **Cloudflare Workers**: Fast, serverless deployment with global edge locations
- 🔒 **Safety Features**: Built-in content filtering and safety settings
- 📝 **Command Support**: Built-in commands like `/start` and `/help`
- 🚀 **Easy Deployment**: Simple setup and deployment process

## Prerequisites

Before you begin, you'll need:

1. **Google Cloud Project** with Gemini API enabled
2. **Telegram Bot Token** from [@BotFather](https://t.me/botfather)
3. **Cloudflare Account** with Workers enabled
4. **Node.js** (version 16 or higher)

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key for later use

### 2. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token for later use

### 3. Configure Environment Variables

Edit the `wrangler.toml` file and replace the placeholder values:

```toml
[vars]
GEMINI_API_KEY = "your-actual-gemini-api-key"
TELEGRAM_BOT_TOKEN = "your-actual-telegram-bot-token"
DEBUG = "false"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Deploy to Cloudflare Workers

```bash
# Deploy to production
npm run deploy

# Or for development
npm run dev
```

### 6. Set Up Telegram Webhook

After deployment, visit your worker's setup endpoint:

```
https://your-worker.your-subdomain.workers.dev/setup-webhook
```

This will configure Telegram to send webhook requests to your worker.

## Project Structure

```
├── src/
│   └── index.js          # Main worker code
├── wrangler.toml         # Cloudflare Workers configuration
├── package.json          # Project dependencies and scripts
└── README.md            # This file
```

## API Endpoints

- **`/webhook`** (POST): Receives Telegram webhook updates
- **`/setup-webhook`** (GET): Sets up Telegram webhook
- **`/health`** (GET): Health check endpoint
- **`/`** (GET): Default welcome message

## Bot Commands

- **`/start`**: Welcome message and bot introduction
- **`/help`**: Shows available commands and usage information

## Configuration Options

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `DEBUG`: Enable debug logging (true/false)

### Gemini API Settings

The bot uses the following Gemini configuration:

- **Model**: `gemini-pro`
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 1000
- **Safety Settings**: Medium threshold for all categories

## Customization

### Modifying Bot Behavior

Edit the `processMessageWithGemini` function in `src/index.js` to customize:

- Response style and tone
- Context and personality
- Response length and format

### Adding New Commands

Extend the `handleCommand` function to add new bot commands:

```javascript
case '/custom':
  const customMessage = "Your custom response here";
  await sendTelegramMessage(chatId, customMessage, env);
  break;
```

### Adjusting Safety Settings

Modify the `safetySettings` in the Gemini API request to adjust content filtering levels.

## Troubleshooting

### Common Issues

1. **Webhook not receiving updates**
   - Check if the webhook was set correctly
   - Verify your worker URL is accessible
   - Ensure HTTPS is enabled

2. **Gemini API errors**
   - Verify your API key is correct
   - Check API quota and billing
   - Ensure Gemini API is enabled in your Google Cloud project

3. **Telegram API errors**
   - Verify your bot token is correct
   - Check if the bot is active
   - Ensure webhook URL is accessible

### Debug Mode

Enable debug logging by setting `DEBUG = "true"` in `wrangler.toml` to see detailed logs in the Cloudflare Workers console.

## Security Considerations

- **API Keys**: Never commit API keys to version control
- **Webhook Security**: Consider implementing webhook signature verification
- **Rate Limiting**: Implement rate limiting for production use
- **Input Validation**: Add additional input validation as needed

## Performance

- **Response Time**: Typically 1-3 seconds depending on Gemini API response time
- **Concurrent Users**: Cloudflare Workers can handle thousands of concurrent requests
- **Global Distribution**: Workers run at edge locations worldwide for low latency

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review Cloudflare Workers logs
3. Verify API configurations
4. Check Telegram Bot API status

## Changelog

### v1.0.0
- Initial release
- Basic Gemini AI integration
- Telegram webhook support
- Command handling
- Safety settings and content filtering
