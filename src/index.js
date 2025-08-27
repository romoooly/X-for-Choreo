/**
 * Gemini Chatbot for Telegram - Cloudflare Workers
 * 
 * This worker handles Telegram bot webhooks and integrates with Google's Gemini API
 * to provide AI-powered responses to user messages.
 */

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Telegram Bot API configuration
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

/**
 * Main worker handler
 */
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle Telegram webhook
      if (url.pathname === '/webhook' && request.method === 'POST') {
        return await handleTelegramWebhook(request, env);
      }
      
      // Handle webhook setup
      if (url.pathname === '/setup-webhook' && request.method === 'GET') {
        return await setupTelegramWebhook(env);
      }
      
      // Handle health check
      if (url.pathname === '/health' && request.method === 'GET') {
        return new Response('OK', { status: 200 });
      }
      
      // Default response
      return new Response('Gemini Telegram Bot is running!', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

/**
 * Handle incoming Telegram webhook
 */
async function handleTelegramWebhook(request, env) {
  try {
    const body = await request.json();
    
    if (env.DEBUG === 'true') {
      console.log('Received webhook:', JSON.stringify(body, null, 2));
    }
    
    // Extract message data
    const message = body.message;
    if (!message) {
      return new Response('OK', { status: 200 });
    }
    
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    const userName = message.from.first_name || 'User';
    
    // Ignore non-text messages
    if (!text) {
      return new Response('OK', { status: 200 });
    }
    
    // Handle commands
    if (text.startsWith('/')) {
      return await handleCommand(text, chatId, env);
    }
    
    // Process regular message with Gemini
    const response = await processMessageWithGemini(text, userName, env);
    
    // Send response back to Telegram
    await sendTelegramMessage(chatId, response, env);
    
    return new Response('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook handling error:', error);
    return new Response('OK', { status: 200 }); // Always return OK to Telegram
  }
}

/**
 * Handle bot commands
 */
async function handleCommand(command, chatId, env) {
  const lowerCommand = command.toLowerCase();
  
  switch (lowerCommand) {
    case '/start':
      const startMessage = `🤖 Welcome! I'm your Gemini-powered AI assistant.\n\n` +
        `I can help you with:\n` +
        `• General questions and conversations\n` +
        `• Creative writing and brainstorming\n` +
        `• Problem solving and analysis\n` +
        `• And much more!\n\n` +
        `Just send me a message and I'll respond using Google's Gemini AI.`;
      
      await sendTelegramMessage(chatId, startMessage, env);
      break;
      
    case '/help':
      const helpMessage = `📚 Here's how to use me:\n\n` +
        `• Send any message and I'll respond with AI-generated content\n` +
        `• Use /start to see this welcome message\n` +
        `• Use /help to see this help message\n\n` +
        `Powered by Google Gemini AI 🤖`;
      
      await sendTelegramMessage(chatId, helpMessage, env);
      break;
      
    default:
      await sendTelegramMessage(chatId, "Unknown command. Use /help for available commands.", env);
  }
  
  return new Response('OK', { status: 200 });
}

/**
 * Process message with Gemini API
 */
async function processMessageWithGemini(message, userName, env) {
  try {
    const prompt = `You are a helpful AI assistant named Gemini. You're chatting with ${userName} on Telegram. 
    
Please respond to their message in a friendly, helpful manner. Keep responses concise but informative (preferably under 500 characters for Telegram). 
    
User's message: ${message}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
    
  } catch (error) {
    console.error('Gemini processing error:', error);
    return `Sorry, I'm having trouble processing your request right now. Please try again later. (Error: ${error.message})`;
  }
}

/**
 * Send message to Telegram
 */
async function sendTelegramMessage(chatId, text, env) {
  try {
    const url = `${TELEGRAM_API_URL}${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', response.status, errorText);
    }
    
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

/**
 * Setup Telegram webhook
 */
async function setupTelegramWebhook(env) {
  try {
    const webhookUrl = `https://${env.CF_WORKER_DOMAIN || 'your-worker.your-subdomain.workers.dev'}/webhook`;
    
    const url = `${TELEGRAM_API_URL}${env.TELEGRAM_BOT_TOKEN}/setWebhook`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message']
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      return new Response(`Webhook set successfully to: ${webhookUrl}`, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      return new Response(`Failed to set webhook: ${JSON.stringify(result)}`, {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
  } catch (error) {
    console.error('Webhook setup error:', error);
    return new Response(`Error setting webhook: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}