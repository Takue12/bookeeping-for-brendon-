require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ POST endpoint to handle chat messages
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4'
      messages: [
        { role: 'system', content: "You are NexaBot, a helpful AI bookkeeping assistant." },
        { role: 'user', content: userMessage }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ NexaBot backend running at http://localhost:${port}`);
});
