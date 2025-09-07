# Vercel Development Setup Guide

## Overview

This project uses a hybrid architecture combining a single-file React application (`index.html`) with Vercel serverless functions for external API integration. This guide covers the complete setup process for local development and deployment.

## Architecture

### Frontend
- **Single File Application**: `index.html` with React, Babel, and Tailwind CSS via CDN
- **No Build Step**: Direct browser execution for maximum simplicity
- **State Management**: React hooks with localStorage persistence

### Backend (Serverless Functions)
- **Function Location**: `api/search.js` - Brave Search API proxy
- **Runtime**: Node.js on Vercel Functions
- **CORS Handling**: Built-in cross-origin request support
- **Security**: Server-side API key management via environment variables

## Local Development Setup

### Prerequisites
1. **Node.js**: Version 18+ recommended
2. **Vercel CLI**: Global installation required
3. **API Keys**: Brave Search API key

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Authentication
```bash
vercel login
```
Follow browser prompts to authenticate with your Vercel account.

### Step 3: Environment Configuration
Create `.env.local` in project root:
```bash
BRAVE_API_KEY=your_brave_search_api_key_here
```

**Security Note**: `.env.local` is protected by `.gitignore` and never committed to the repository.

### Step 4: Start Development Server
```bash
vercel dev
```

This command:
- Starts local server at `http://localhost:3000`. To use a different port, use the `--listen` flag: `vercel dev --listen 4000`
- Enables serverless functions at `/api/*` endpoints
- Loads environment variables from `.env.local`
- Provides hot reload for function changes

## File Structure

```
project-root/
├── index.html                 # Main React application
├── api/
│   └── search.js             # Serverless function for web search
├── vercel.json               # Vercel configuration
├── .env.local               # Environment variables (not committed)
├── .gitignore               # Protects secrets
└── docs/
    └── VERCEL_SETUP.md      # This guide
```

## API Integration Details

### Serverless Function (`api/search.js`)
```javascript
export default async function handler(req, res) {
  // CORS headers for browser compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Extract query from request body
  const { query } = req.body;
  
  // Fetch API key from environment variables
  const apiKey = process.env.BRAVE_API_KEY;
  
  // Make request to Brave Search API
  const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'X-Subscription-Token': apiKey,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  return res.status(200).json(data);
}
```

### Frontend Integration
```javascript
// Example API call from frontend
const analyzeUniqueness = async (attributeText) => {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `"${attributeText}" software features capabilities`
    })
  });
  
  const searchData = await response.json();
  return searchData;
};
```

## Configuration Files

### `vercel.json`
```json
{
  "functions": {
    "api/search.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Key Settings:**
- `maxDuration`: 30 seconds timeout for API calls
- `rewrites`: Route configuration for SPA and API endpoints

## Testing and Validation

### 1. Server Status Check
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Expected: 200
```

### 2. API Endpoint Test
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test software features"}' \
  | head -c 200
# Expected: JSON response with search results
```

### 3. Frontend Integration Test
1. Navigate to `http://localhost:4000`
2. Go to Section 4 "Value and Proof"
3. Enter attribute text
4. Click "Analyze Uniqueness" button
5. Verify results appear (or check browser console for errors)

## Troubleshooting

### Common Issues

1. **API Configuration Error**
   - **Symptom**: "Analysis unavailable - please try again later"
   - **Solution**: Verify `BRAVE_API_KEY` in `.env.local` and restart `vercel dev`

2. **CORS Errors**
   - **Symptom**: Browser console shows CORS policy errors
   - **Solution**: Verify CORS headers in `api/search.js` are properly set

3. **Function Runtime Error**
   - **Symptom**: "Function Runtimes must have a valid version"
   - **Solution**: Remove explicit runtime specification in `vercel.json`

4. **Environment Variables Not Loading**
   - **Symptom**: API returns authentication errors
   - **Solution**: Restart `vercel dev` after modifying `.env.local`

### Debug Steps
1. Check server logs in terminal running `vercel dev`
2. Open browser Developer Tools (F12) and check Console tab
3. Monitor Network tab for failed API requests
4. Verify API key is not exposed client-side

## Deployment

### Production Deployment
```bash
vercel --prod
```

### Environment Variables in Production
Set production environment variables via Vercel dashboard:
1. Go to project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add `BRAVE_API_KEY` with production value
4. Redeploy application

## Performance Considerations

- **Cold Starts**: First API call may take 1-2 seconds (serverless cold start)
- **Concurrent Requests**: Vercel automatically scales functions
- **Rate Limits**: Brave Search API has usage limits (monitor in production)
- **Caching**: Consider implementing response caching for repeated queries

## Security Best Practices

1. **API Key Protection**: Never expose API keys client-side
2. **CORS Configuration**: Restrict origins in production if needed
3. **Input Validation**: Sanitize search queries in serverless function
4. **Rate Limiting**: Implement request throttling for production use
5. **Error Handling**: Don't expose internal errors to client

## Integration Status

### Currently Implemented
- ✅ F-5 (Uniqueness Attribute Validation) using web search
- ✅ Serverless proxy for Brave Search API
- ✅ CORS handling for browser compatibility
- ✅ Environment variable security

### Ready for Implementation
- 🚧 F-6 (Trend Validation) using same serverless pattern
- 🚧 Additional search endpoints for different use cases
- 🚧 Response caching for improved performance

## Cost Analysis

### Development
- **Vercel Functions**: Free tier (100GB-hours monthly)
- **Brave Search API**: Free tier (2,000 queries monthly)
- **Total**: $0/month for development

### Production Estimates
- **Vercel Pro**: $20/month (if exceeding free tier)
- **Brave Search**: $5/1000 additional queries
- **Expected Usage**: Within free tiers for MVP deployment

This setup provides a production-ready serverless architecture while maintaining the project's single-file simplicity paradigm.
