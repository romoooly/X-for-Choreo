export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const update = await request.json();
      if (update.message) {
        const chatId = update.message.chat.id;
        const userMessage = update.message.text || '';

        const reply = await getGeminiReply(userMessage, env.GEMINI_API_KEY);

        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, reply);
      }
      return new Response('OK');
    }
    return new Response('Hello, Gemini Telegram Bot!');
  }
};

async function getGeminiReply(prompt, apiKey) {
  const body = {
    contents: [{ parts: [{ text: prompt }]}],
    generationConfig: { temperature: 0.7, top_k: 40, top_p: 0.95 }
  };
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    return 'Error contacting Gemini API';
  }
  const data = await resp.json();
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (_) {
    return 'Sorry, I could not parse Gemini response.';
  }
}

async function sendTelegramMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}