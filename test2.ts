import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  const finalApiKey = process.env.GEMINI_API_KEY;
  if (!finalApiKey) {
    console.log("NO API KEY");
    return;
  }
  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  const models = ['gemini-3.1-pro-preview', 'gemini-3.1-flash-lite-preview', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  
  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
      });
      console.log(`${model} OK`);
    } catch (e) {
      console.log(`${model} ERR: ${e.message}`);
    }
  }
}
test();
