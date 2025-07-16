require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is missing from environment variables');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configure in production
  methods: ['POST']
}));
app.use(bodyParser.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST route for chatbot
app.post('/chat', async (req, res) => {
  // Validate request
  if (!req.body.prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract AI response
    const aiReply = chatResponse.choices[0].message?.content || 'No response generated';
    
    res.json({ 
      reply: aiReply,
      usage: chatResponse.usage
    });
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    const status = error.status || 500;
    res.status(status).json({ 
      error: 'AI processing error',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ CTHIA backend active at http://localhost:${port}`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🔴 Server shutting down');
  process.exit(0);
});
