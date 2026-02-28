// server/utils/poe.js

/**
 * Query a bot on Poe via the OpenAI-compatible API.
 *
 * Requires: POE_API_KEY from https://poe.com/api_key
 */

async function queryPoe(prompt, botName = 'gpt-4o') {
    const apiKey = process.env.POE_API_KEY;
    if (!apiKey) throw new Error('POE_API_KEY is not set in .env');
  
    console.log('[POE] Querying bot:', botName);
  
    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: botName,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  
    const raw = await response.text();
    console.log('[POE] Response status:', response.status);
    console.log('[POE] Raw (first 300 chars):', raw.substring(0, 300));
  
    if (!response.ok) {
      throw new Error(`Poe API ${response.status}: ${raw}`);
    }
  
    try {
      const data = JSON.parse(raw);
      const text = data.choices?.[0]?.message?.content || '';
      console.log('[POE] Parsed content length:', text.length);
      return text;
    } catch (e) {
      console.error('[POE] JSON parse error:', e.message);
      throw new Error('Failed to parse Poe API response');
    }
  }
  
  module.exports = { queryPoe };