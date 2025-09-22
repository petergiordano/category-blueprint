export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests for search
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Extract query from request body
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Make request to Brave Search API
    const searchUrl = 'https://api.search.brave.com/res/v1/web/search';
    const searchParams = new URLSearchParams({
      q: query,
      count: 10,
      search_lang: 'en',
      country: 'us',
      safesearch: 'moderate'
    });

    const response = await fetch(`${searchUrl}?${searchParams}`, {
      method: 'GET',
      headers: {
        'X-Subscription-Token': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Brave API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'Search API request failed',
        details: response.statusText 
      });
    }

    const searchResults = await response.json();

    // Return the search results
    return res.status(200).json(searchResults);

  } catch (error) {
    console.error('Search proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}