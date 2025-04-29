// backend/src/services/openai.service.js

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


export async function anonymizeText(text) {
  const payload = {
    model: 'gpt-4.1',  
    messages: [
      {
        role: 'system',
        content:
          'You are an anonymization assistant. ' +
          'Replace any PII (names, addresses, phones, emails…) ' +
          'with generic placeholders like <NAME>, <EMAIL>, <PHONE> ' +
          'while keeping the text readable.'
      },
      { role: 'user', content: text }
    ]
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  };

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data } = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers,
          timeout: 60000  // 60 s
        }
      );
      return data.choices[0].message.content.trim();
    } catch (err) {
      lastError = err;
      const msg = err.response?.data?.error?.message || err.message;
      console.warn(`OpenAI attempt ${attempt} failed: ${msg}`);
      if (attempt === 2) break;
      // Petite pause avant retry
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  const finalMsg =
    lastError.response?.data?.error?.message ||
    lastError.message ||
    'Unknown OpenAI error';
  throw new Error(`OpenAI error after retry: ${finalMsg}`);
}
