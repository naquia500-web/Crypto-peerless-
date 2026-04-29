import { GoogleGenAI } from '@google/genai';

async function test() {
  const finalApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBQWrotiRDJcPg_Y8EfLk-baV91sJ_08x0';
  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  const models = ['gemini-3.1-pro-preview', 'gemini-3.1-flash-lite-preview', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  
  for (const model of models) {
    try {
      console.log(`Testing ${model}...`);
      const res = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: 'say hi' }] }]
      });
      console.log(`${model} Result: ${res.text}`);
    } catch (e) {
      console.log(`${model} Error: ${e.message}`);
    }
  }
}
test();
