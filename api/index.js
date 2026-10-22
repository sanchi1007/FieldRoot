// Serverless entry point for Vercel deployment
let app;
let initError = null;

try {
  app = require('../backend/index.js');
} catch (err) {
  console.error('Failed to initialize backend/index.js:', err);
  initError = {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  };
}

module.exports = (req, res) => {
  if (initError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify(
        {
          success: false,
          error: 'Backend initialization failed',
          details: initError
        },
        null,
        2
      )
    );
  }

  // Built-in lightweight health & debug endpoint
  if (req.url === '/api/serverless-debug' || req.url === '/serverless-debug') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify(
        {
          status: 'ok',
          runtime: 'vercel-serverless',
          url: req.url,
          method: req.method,
          hasApp: typeof app === 'function',
          hasMongoUri: Boolean(process.env.MONGODB_URI),
          nodeVersion: process.version,
          timestamp: new Date().toISOString()
        },
        null,
        2
      )
    );
  }

  try {
    return app(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify(
        {
          success: false,
          error: 'Backend request execution failed',
          message: err.message,
          stack: err.stack
        },
        null,
        2
      )
    );
  }
};
