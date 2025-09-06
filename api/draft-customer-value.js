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
    // Extract JTBD data from request body
    const { jtbdData } = req.body;

    if (!jtbdData) {
      return res.status(400).json({ error: 'JTBD data is required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Create comprehensive search queries based on JTBD data
    const searchQueries = [
      `"${jtbdData['Context']}" B2B software value proposition examples`,
      `enterprise "${jtbdData['Desired Outcomes']}" customer value framework`,
      `"${jtbdData['Struggling Moments']}" solution benefits ROI business case`,
      'B2B SaaS customer value proposition table stakes functional individual aspirational',
      'enterprise software buying criteria value perception framework'
    ];

    // Execute searches to gather intelligence
    const searchResults = [];
    for (const query of searchQueries) {
      try {
        const searchUrl = 'https://api.search.brave.com/res/v1/web/search';
        const searchParams = new URLSearchParams({
          q: query,
          count: 3,
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

        if (response.ok) {
          const data = await response.json();
          if (data.web && data.web.results) {
            searchResults.push(...data.web.results.slice(0, 2));
          }
        }
      } catch (error) {
        console.log(`Search query failed: ${query}`);
        // Continue with other queries even if one fails
      }
    }

    // Analyze JTBD data and generate Customer Value drafts
    const customerValueDrafts = generateCustomerValueDrafts(jtbdData, searchResults);

    return res.status(200).json({
      success: true,
      drafts: customerValueDrafts,
      context: {
        jtbdAnalyzed: Object.keys(jtbdData).length,
        researchSources: searchResults.length
      }
    });

  } catch (error) {
    console.error('Customer Value drafting error:', error);
    return res.status(500).json({ 
      error: 'AI drafting service temporarily unavailable',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function generateCustomerValueDrafts(jtbdData, searchResults) {
  // Extract key insights from JTBD data
  const context = jtbdData['Context'] || '';
  const struggles = jtbdData['Struggling Moments'] || '';
  const pushes = jtbdData['Pushes'] || '';
  const anxieties = jtbdData['Anxieties'] || '';
  const outcomes = jtbdData['Desired Outcomes'] || '';
  const tableStakes = jtbdData['Basic Quality (Table Stakes)'] || '';
  const hiringCriteria = jtbdData['Hiring Criteria'] || '';

  // Generate drafts based on JTBD insights and research
  const drafts = {
    'Table Stakes': generateTableStakesDraft(tableStakes, anxieties, context),
    'Functional Value': generateFunctionalValueDraft(outcomes, struggles, context),
    'Ease of Doing Business': generateEaseOfBusinessDraft(anxieties, pushes, context),
    'Individual Value': generateIndividualValueDraft(hiringCriteria, pushes, context),
    'Aspirational Value': generateAspirationalValueDraft(outcomes, context, pushes)
  };

  return drafts;
}

function generateTableStakesDraft(tableStakes, anxieties, context) {
  if (!tableStakes && !anxieties) {
    return 'Enterprise-grade security (SOC2 Type II), proven scalability, regulatory compliance, and seamless integration with existing systems.';
  }

  let draft = '';
  
  if (tableStakes) {
    draft = tableStakes;
  } else {
    // Infer from anxieties what table stakes might be needed
    if (anxieties.toLowerCase().includes('security')) {
      draft += 'Enterprise-grade security certifications, ';
    }
    if (anxieties.toLowerCase().includes('integration') || anxieties.toLowerCase().includes('system')) {
      draft += 'seamless system integration, ';
    }
    if (anxieties.toLowerCase().includes('compliance') || context.toLowerCase().includes('regulated')) {
      draft += 'regulatory compliance, ';
    }
    
    draft += 'proven enterprise reliability and vendor stability.';
  }

  return draft;
}

function generateFunctionalValueDraft(outcomes, struggles, context) {
  if (!outcomes && !struggles) {
    return 'Measurable efficiency gains, cost reduction, and improved business outcomes with clear ROI within 12 months.';
  }

  let draft = '';
  
  if (outcomes) {
    // Parse desired outcomes and make them more specific
    draft = outcomes;
    
    // Add quantification if missing
    if (!draft.match(/\d+%|\$|\d+ hours|\d+ days/)) {
      draft += ' — measurable improvements typically showing 20-40% efficiency gains and positive ROI within 6-12 months';
    }
  } else if (struggles) {
    // Convert struggles into functional value
    draft = `Eliminates ${struggles.toLowerCase()} through automated processes, reducing manual effort and human error`;
  }

  return draft;
}

function generateEaseOfBusinessDraft(anxieties, pushes, context) {
  let draft = 'Streamlined implementation with proven methodologies, ';
  
  if (anxieties) {
    if (anxieties.toLowerCase().includes('implementation') || anxieties.toLowerCase().includes('migration')) {
      draft += 'low-risk migration approach, ';
    }
    if (anxieties.toLowerCase().includes('training') || anxieties.toLowerCase().includes('adoption')) {
      draft += 'intuitive user experience requiring minimal training, ';
    }
  }
  
  if (pushes && pushes.toLowerCase().includes('time')) {
    draft += 'rapid deployment, ';
  }
  
  draft += 'dedicated customer success management, and 24/7 enterprise support.';
  
  return draft;
}

function generateIndividualValueDraft(hiringCriteria, pushes, context) {
  let draft = '';
  
  if (hiringCriteria) {
    draft = `Provides ${hiringCriteria.toLowerCase()} that enhances team credibility and professional standing. `;
  }
  
  draft += 'Decision-makers gain recognition for driving innovation, IT leaders ensure system reliability, ';
  
  if (context.toLowerCase().includes('finance') || context.toLowerCase().includes('accounting')) {
    draft += 'finance teams reduce manual work and audit stress, ';
  } else if (context.toLowerCase().includes('sales') || context.toLowerCase().includes('marketing')) {
    draft += 'revenue teams gain better pipeline visibility, ';
  } else {
    draft += 'end users save time on repetitive tasks, ';
  }
  
  draft += 'while executives demonstrate measurable business impact.';
  
  return draft;
}

function generateAspirationalValueDraft(outcomes, context, pushes) {
  let draft = '';
  
  if (context.toLowerCase().includes('digital') || pushes.toLowerCase().includes('digital')) {
    draft += 'Positions organization as a digital leader, ';
  }
  
  if (outcomes.toLowerCase().includes('compliance') || context.toLowerCase().includes('audit')) {
    draft += 'supports governance and regulatory excellence, ';
  }
  
  if (pushes.toLowerCase().includes('competitive') || pushes.toLowerCase().includes('market')) {
    draft += 'creates sustainable competitive advantage, ';
  }
  
  draft += 'demonstrates innovation commitment to board and investors, and aligns with long-term strategic vision for operational excellence.';
  
  return draft;
}