// Load environment variables from .env
require('dotenv').config();

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// Set up Express server
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Your key must be in your .env file like: OPENAI_API_KEY=sk-...
});
const openai = new OpenAIApi(configuration);

// POST endpoint for chatbot
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "Failed to get response from AI." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ NexaBot backend running at http://localhost:${port}`);
});
