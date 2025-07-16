require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// ✅ OpenAI API setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ POST endpoint for chat
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

app.listen(port, () => {
  console.log(`✅ NexaBot backend running at http://localhost:${port}`);
});
