const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: "You are NexaBot, a friendly and smart bookkeeping assistant powered by QuickBooks. Answer clearly and concisely." },
        { role: 'user', content: userMessage }
      ]
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(3001, () => {
  console.log('✅ NexaBot backend running on http://localhost:3001');
});
