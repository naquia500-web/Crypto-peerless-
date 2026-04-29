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
  try {
    const res = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: 'a futuristic city',
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9'
      }
    });
    console.log("images ok:", res.generatedImages ? res.generatedImages.length : 0);
  } catch (e) {
    console.log("ERR:", e.message);
  }
}
test();
