// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// OpenAI API setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(cors());
app.use(express.json());

// Chatbot route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Please send a valid message." });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4', // or 'gpt-3.5-turbo' if you prefer
      messages: [
        { role: 'system', content: "You are NexaBot, a helpful AI bookkeeping assistant for small businesses and individuals using QuickBooks. Offer clear, friendly financial advice, service info, and help with getting started." },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    });

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    res.status(500).json({ reply: "Sorry, I had trouble responding. Please try again later." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ NexaBot server running at http://localhost:${port}`);
});
