/**
 * Telegram Bot with Gemini AI on Cloudflare Workers
 */

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle different request methods
      if (request.method === 'GET') {
        return new Response('Telegram Bot is running!', { status: 200 });
      }

      if (request.method === 'POST') {
        const update = await request.json();
        return await handleTelegramUpdate(update, env);
      }

      return new Response('Method not allowed', { status: 405 });
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

/**
 * Handle incoming Telegram updates
 */
async function handleTelegramUpdate(update, env) {
  try {
    // Extract message from update
    const message = update.message;
    if (!message || !message.text) {
      return new Response('OK', { status: 200 });
    }

    const chatId = message.chat.id;
    const userMessage = message.text;
    const userId = message.from.id;
    const userName = message.from.first_name || 'User';

    console.log(`Received message from ${userName} (${userId}): ${userMessage}`);

    // Send typing action
    await sendTypingAction(chatId, env.TELEGRAM_BOT_TOKEN);

    // Generate response using Gemini AI
    const aiResponse = await generateGeminiResponse(userMessage, userName, env.GEMINI_API_KEY);

    // Send response back to user
    await sendTelegramMessage(chatId, aiResponse, env.TELEGRAM_BOT_TOKEN);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling Telegram update:', error);
    return new Response('OK', { status: 200 });
  }
}

/**
 * Generate response using Gemini AI
 */
async function generateGeminiResponse(userMessage, userName, apiKey) {
  try {
    const prompt = `You are a helpful and friendly chatbot. The user's name is ${userName}. 
    Respond naturally and helpfully to their message. Keep responses conversational and engaging.
    
    User message: ${userMessage}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return `Sorry ${userName}, I'm having trouble processing your request right now. Please try again later.`;
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error('Unexpected Gemini API response structure:', data);
      return `Sorry ${userName}, I couldn't generate a proper response. Please try rephrasing your message.`;
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Sorry ${userName}, I'm experiencing technical difficulties. Please try again later.`;
  }
}

/**
 * Send typing action to show bot is processing
 */
async function sendTypingAction(chatId, botToken) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendChatAction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        action: 'typing'
      })
    });
  } catch (error) {
    console.error('Error sending typing action:', error);
  }
}

/**
 * Send message to Telegram
 */
async function sendTelegramMessage(chatId, text, botToken) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error sending message to Telegram:', response.status, errorText);
    }

    return response;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;
  }
}