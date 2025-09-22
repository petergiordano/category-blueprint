export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Extract company context from request body
    const { companyName, companyUrl, industry, productName, targetMarket } = req.body;

    if (!companyName || !companyUrl) {
      return res.status(400).json({ 
        error: 'Company name and URL are required for analysis' 
      });
    }

    console.log('Starting comprehensive company analysis for:', companyName);

    // Step 1: Discover JTBD using the existing discover-jtbd endpoint
    console.log('Step 1: Discovering JTBD framework...');
    
    const companyContext = {
      companyName,
      industry,
      productName,
      targetMarket
    };

    // Call the discover-jtbd endpoint internally
    const jtbdResponse = await callDiscoverJTBD(companyUrl, companyContext);
    
    if (!jtbdResponse.success) {
      throw new Error(`JTBD discovery failed: ${jtbdResponse.error}`);
    }

    console.log('Step 2: Company analysis complete');

    // Return comprehensive analysis results
    return res.status(200).json({
      success: true,
      analysis: {
        companyInfo: {
          name: companyName,
          url: companyUrl,
          industry: industry || 'Not specified',
          product: productName || 'Not specified',
          targetMarket: targetMarket || 'Not specified'
        },
        jtbdFramework: jtbdResponse.jtbdAnalysis,
        analysisMetadata: {
          analyzedAt: new Date().toISOString(),
          method: 'AI-powered web analysis with market intelligence',
          dataPoints: {
            websiteAnalysis: true,
            marketResearch: true,
            intelligentTemplating: true
          }
        }
      }
    });

  } catch (error) {
    console.error('Company analysis error:', error);
    return res.status(500).json({ 
      error: 'Company analysis service temporarily unavailable',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Internal function to call the discover-jtbd endpoint
async function callDiscoverJTBD(companyUrl, companyContext) {
  try {
    // For Vercel serverless functions, we can directly import and call the function
    // This avoids HTTP overhead and potential port issues
    const discoverJtbd = await import('./discover-jtbd.js');
    
    // Create a mock request/response for the function
    const mockReq = {
      method: 'POST',
      body: {
        companyUrl,
        companyContext
      }
    };
    
    const mockRes = {
      statusCode: 200,
      status: (code) => {
        mockRes.statusCode = code;
        return mockRes;
      },
      json: (data) => {
        mockRes.responseData = data;
        return data;
      },
      end: () => {
        return mockRes.responseData || {};
      },
      setHeader: () => {},
      responseData: null
    };
    
    // Call the function directly
    const result = await discoverJtbd.default(mockReq, mockRes);
    
    // Check if the result is successful or if we need to extract from response
    if (mockRes.responseData) {
      return mockRes.responseData;
    }
    
    return result || mockRes.responseData || {
      success: false,
      error: 'No response data received'
    };
    
  } catch (error) {
    console.error('Error calling discover-jtbd:', error);
    return {
      success: false,
      error: error.message
    };
  }
}