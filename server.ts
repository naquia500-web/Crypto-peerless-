import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import OpenAI from "openai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/masterclass", async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
      const isOR = apiKey?.startsWith("sk-or-");
      const isGemini = apiKey && !apiKey.startsWith("sk-");
      if (!apiKey) {
         return res.status(400).json({ error: "Missing API Key. Please provide it in the input box, or add it via Settings in AI Studio." });
      }
      const openai = new OpenAI({
         baseURL: isGemini ? "https://generativelanguage.googleapis.com/v1beta/openai/" : isOR ? "https://openrouter.ai/api/v1" : undefined,
         apiKey: apiKey,
         defaultHeaders: isOR ? {
           "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
           "X-Title": "Crypto AI Tools"
         } : undefined
      });
      const { topic } = req.body;
      const response = await openai.chat.completions.create({
        model: isGemini ? "gemini-2.5-flash" : isOR ? "openai/gpt-4o-mini" : "gpt-4o-mini", // Fallback to accessible model
        messages: [
          { role: "system", content: "You are an expert Crypto Masterclass AI. Provide comprehensive, accurate educational content about " + topic + "." },
        ],
        max_tokens: 2000
      });
      res.json({ content: response.choices[0].message.content });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/portfolio-doctor", async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
      const isOR = apiKey?.startsWith("sk-or-");
      const isGemini = apiKey && !apiKey.startsWith("sk-");
      if (!apiKey) {
         return res.status(400).json({ error: "Missing API Key. Please provide it in the input box, or add it via Settings in AI Studio." });
      }
      const openai = new OpenAI({
         baseURL: isGemini ? "https://generativelanguage.googleapis.com/v1beta/openai/" : isOR ? "https://openrouter.ai/api/v1" : undefined,
         apiKey: apiKey,
         defaultHeaders: isOR ? {
           "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
           "X-Title": "Crypto AI Tools"
         } : undefined
      });
      const { portfolio } = req.body;
      
      const response = await openai.chat.completions.create({
        model: isGemini ? "gemini-2.5-pro" : isOR ? "openai/gpt-4o" : "gpt-4o",
        messages: [
          { role: "system", content: "You are the AI Portfolio Doctor. Analyze the following crypto holdings, risk profile, and suggest diversification. Format clearly in Markdown." },
          { role: "user", content: "Holdings: " + JSON.stringify(portfolio) }
        ],
        max_tokens: 2000
      });
      res.json({ content: response.choices[0].message.content });
    } catch (e: any) {
       console.error(e);
       res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
