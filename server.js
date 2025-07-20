require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');

const app = express();
const port = process.env.PORT || 3001;

// Validate critical environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Critical error: ${env} is missing from environment variables`);
    process.exit(1);
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));

// Rate limiting - prevent brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
  keyGenerator: (req) => {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10kb' })); // Body parsing with size limit
app.use(compression());
app.use(morgan('combined')); // HTTP request logging

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000 // 15-second timeout
});

// Input validation middleware
const validateChatInput = (req, res, next) => {
  if (!req.body.prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  if (typeof req.body.prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt must be a string' });
  }
  
  if (req.body.prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt exceeds maximum length of 2000 characters' });
  }
  
  next();
};

// POST route for chatbot with security checks
app.post('/chat', apiLimiter, validateChatInput, async (req, res) => {
  const userPrompt = req.body.prompt.trim();

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract AI response
    const aiReply = chatResponse.choices[0]?.message?.content || 'No response generated';
    
    res.json({ 
      reply: aiReply,
      usage: chatResponse.usage
    });
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    
    // Enhanced error mapping
    let status = 500;
    let errorMessage = 'AI processing error';
    
    if (error.status) {
      status = error.status;
      if (error.status === 429) errorMessage = 'API rate limit exceeded';
      if (error.status === 401) errorMessage = 'Invalid API credentials';
      if (error.status === 400) errorMessage = 'Invalid request to AI service';
    }
    
    res.status(status).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'active',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'NexaLedger AI Bookkeeping API',
    version: '1.0.0',
    status: 'operational',
    documentation: 'https://github.com/your-repo/docs'
  });
});

// Start server with HTTPS in production
const startServer = () => {
  if (process.env.NODE_ENV === 'production' && 
      process.env.HTTPS_KEY_PATH && 
      process.env.HTTPS_CERT_PATH) {
    
    try {
      const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH, 'utf8');
      const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH, 'utf8');
      const credentials = { key: privateKey, cert: certificate };

      https.createServer(credentials, app).listen(port, () => {
        console.log(`✅ NexaLedger HTTPS server running at https://localhost:${port}`);
      });
    } catch (err) {
      console.error('❌ HTTPS setup failed:', err.message);
      process.exit(1);
    }
  } else {
    // HTTP server for development
    app.listen(port, () => {
      console.log(`✅ NexaLedger HTTP server running at http://localhost:${port}`);
    });
  }
};

// Start the server
try {
  startServer();
} catch (err) {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
}

// Handle shutdown gracefully
const shutdown = (signal) => {
  console.log(`\n🔴 Received ${signal}. Server shutting down gracefully...`);
  // Add any cleanup operations here
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('uncaughtException', (err, origin) => {
  console.error('🛑 Uncaught Exception:', err, 'Origin:', origin);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'Reason:', reason);
});
