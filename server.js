require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ POST route for chatbot
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ NexaBot backend running at http://localhost:${port}`);
});
