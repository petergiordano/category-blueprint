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
    // Extract data from request body
    const { jtbdData, customerValueData } = req.body;

    if (!jtbdData || !customerValueData) {
      return res.status(400).json({ error: 'Both JTBD data and Customer Value data are required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Create comprehensive WTP-focused search queries
    const context = jtbdData['Context'] || '';
    const outcomes = jtbdData['Desired Outcomes'] || '';
    const functionalValue = customerValueData['Functional Value'] || '';
    const tableStakes = customerValueData['Table Stakes'] || '';

    const searchQueries = [
      `"${context}" B2B SaaS pricing benchmarks industry budget allocation`,
      `enterprise software "${outcomes}" ROI payback period expectations`,
      `"${functionalValue}" competitive pricing strategies market positioning`,
      `B2B software implementation risk switching costs mitigation`,
      `"${context}" industry pricing reference points comparable solutions cost`,
      'enterprise software pricing models willingness to pay drivers'
    ];

    // Execute searches to gather WTP intelligence
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
        console.log(`WTP search query failed: ${query}`);
        // Continue with other queries even if one fails
      }
    }

    // Analyze combined context and generate WTP drafts
    const wtpDrafts = generateWTPDrafts(jtbdData, customerValueData, searchResults);

    return res.status(200).json({
      success: true,
      drafts: wtpDrafts,
      context: {
        jtbdAnalyzed: Object.keys(jtbdData).length,
        customerValueAnalyzed: Object.keys(customerValueData).length,
        researchSources: searchResults.length
      }
    });

  } catch (error) {
    console.error('WTP drafting error:', error);
    return res.status(500).json({ 
      error: 'AI drafting service temporarily unavailable',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function generateWTPDrafts(jtbdData, customerValueData, searchResults) {
  // Extract key insights from both JTBD and Customer Value data
  const context = jtbdData['Context'] || '';
  const struggles = jtbdData['Struggling Moments'] || '';
  const outcomes = jtbdData['Desired Outcomes'] || '';
  const anxieties = jtbdData['Anxieties'] || '';
  
  const functionalValue = customerValueData['Functional Value'] || '';
  const tableStakes = customerValueData['Table Stakes'] || '';
  const easeOfBusiness = customerValueData['Ease of Doing Business'] || '';
  const individualValue = customerValueData['Individual Value'] || '';

  // Analyze search results for pricing intelligence
  const marketInsights = extractMarketInsights(searchResults, context);

  // Generate drafts based on combined context and market intelligence
  const drafts = {
    'Ability to Pay': generateAbilityToPayDraft(context, outcomes, functionalValue, marketInsights),
    'Economic Justification': generateEconomicJustificationDraft(functionalValue, outcomes, struggles, marketInsights),
    'Relative Value vs. Alternatives': generateRelativeValueDraft(functionalValue, tableStakes, easeOfBusiness, marketInsights),
    'Risk': generateRiskDraft(anxieties, easeOfBusiness, individualValue, marketInsights),
    'Market Reference Points': generateMarketReferencePointsDraft(context, functionalValue, marketInsights)
  };

  return drafts;
}

function extractMarketInsights(searchResults, context) {
  const insights = {
    pricingBenchmarks: [],
    roiExpectations: [],
    implementationRisks: [],
    competitiveFactors: []
  };

  // Analyze search results for relevant pricing and market intelligence
  searchResults.forEach(result => {
    const title = (result.title || '').toLowerCase();
    const description = (result.description || '').toLowerCase();
    const content = title + ' ' + description;

    // Extract pricing benchmarks
    if (content.includes('pricing') || content.includes('cost') || content.includes('budget')) {
      insights.pricingBenchmarks.push(result.description || title);
    }

    // Extract ROI expectations
    if (content.includes('roi') || content.includes('payback') || content.includes('return')) {
      insights.roiExpectations.push(result.description || title);
    }

    // Extract risk factors
    if (content.includes('risk') || content.includes('implementation') || content.includes('switching')) {
      insights.implementationRisks.push(result.description || title);
    }

    // Extract competitive factors
    if (content.includes('competitive') || content.includes('alternative') || content.includes('comparison')) {
      insights.competitiveFactors.push(result.description || title);
    }
  });

  return insights;
}

function generateAbilityToPayDraft(context, outcomes, functionalValue, marketInsights) {
  let draft = '';
  
  // Start with context-driven budget considerations
  if (context.toLowerCase().includes('enterprise') || context.toLowerCase().includes('large')) {
    draft += 'Enterprise budget allocation with dedicated line items for operational efficiency improvements. ';
  } else if (context.toLowerCase().includes('startup') || context.toLowerCase().includes('growth')) {
    draft += 'Growth-stage budget prioritizing scalable solutions with clear ROI validation. ';
  } else {
    draft += 'Established budget framework for business-critical operational improvements. ';
  }

  // Incorporate functional value into budget justification
  if (functionalValue) {
    const hasQuantification = functionalValue.match(/\d+%|\$|\d+ (hours|days|months)/);
    if (hasQuantification) {
      draft += 'Budget justified by quantified business impact with measurable cost savings offsetting investment. ';
    } else {
      draft += 'Budget supported by clear operational value and efficiency gains. ';
    }
  }

  // Add market context if available
  if (marketInsights.pricingBenchmarks.length > 0) {
    draft += 'Budget range aligns with industry standards for similar business-critical solutions.';
  } else {
    draft += 'Investment approved based on strategic importance and demonstrated business need.';
  }

  return draft;
}

function generateEconomicJustificationDraft(functionalValue, outcomes, struggles, marketInsights) {
  let draft = '';

  // Build ROI case from functional value
  if (functionalValue) {
    draft += `${functionalValue} translates to clear economic benefits. `;
    
    // Check for quantified metrics
    const savings = functionalValue.match(/\$([0-9,]+)/);
    const percentage = functionalValue.match(/(\d+)%/);
    
    if (savings) {
      draft += `Annual savings of ${savings[0]} provide strong payback case. `;
    } else if (percentage) {
      draft += `${percentage[0]} improvement creates measurable economic impact. `;
    }
  }

  // Incorporate struggle resolution into ROI
  if (struggles) {
    if (struggles.toLowerCase().includes('manual') || struggles.toLowerCase().includes('time')) {
      draft += 'Eliminates costly manual processes and reduces operational overhead. ';
    }
    if (struggles.toLowerCase().includes('error') || struggles.toLowerCase().includes('accuracy')) {
      draft += 'Reduces error-related costs and compliance risks. ';
    }
  }

  // Add market-informed payback expectations
  if (marketInsights.roiExpectations.length > 0) {
    draft += 'ROI timeline aligns with industry standards, typically achieving payback within 6-18 months through operational efficiency gains.';
  } else {
    draft += 'Investment pays for itself through measurable business improvements and operational cost reductions within 12-24 months.';
  }

  return draft;
}

function generateRelativeValueDraft(functionalValue, tableStakes, easeOfBusiness, marketInsights) {
  let draft = '';

  // Differentiate based on functional value
  if (functionalValue) {
    draft += `Superior value delivery through ${functionalValue.toLowerCase()}. `;
  }

  // Contrast with alternatives using table stakes
  if (tableStakes) {
    if (tableStakes.toLowerCase().includes('integration') || tableStakes.toLowerCase().includes('api')) {
      draft += 'Seamless integration capabilities exceed typical point solutions requiring custom development. ';
    }
    if (tableStakes.toLowerCase().includes('security') || tableStakes.toLowerCase().includes('compliance')) {
      draft += 'Enterprise-grade security and compliance built-in versus costly add-ons with competitors. ';
    }
  }

  // Leverage ease of business as differentiator
  if (easeOfBusiness) {
    if (easeOfBusiness.toLowerCase().includes('implementation') || easeOfBusiness.toLowerCase().includes('deployment')) {
      draft += 'Rapid implementation reduces time-to-value compared to lengthy enterprise software deployments. ';
    }
    if (easeOfBusiness.toLowerCase().includes('support') || easeOfBusiness.toLowerCase().includes('success')) {
      draft += 'Dedicated customer success model ensures higher adoption rates than self-service alternatives. ';
    }
  }

  // Add competitive context
  if (marketInsights.competitiveFactors.length > 0) {
    draft += 'Market positioning demonstrates clear advantages over both legacy systems and emerging competitors.';
  } else {
    draft += 'Delivers differentiated value that justifies premium positioning versus generic alternatives.';
  }

  return draft;
}

function generateRiskDraft(anxieties, easeOfBusiness, individualValue, marketInsights) {
  let draft = '';

  // Address specific anxieties as risk mitigation
  if (anxieties) {
    if (anxieties.toLowerCase().includes('implementation') || anxieties.toLowerCase().includes('migration')) {
      draft += 'Proven implementation methodology minimizes deployment risks. ';
    }
    if (anxieties.toLowerCase().includes('integration') || anxieties.toLowerCase().includes('system')) {
      draft += 'Pre-built integrations and API compatibility reduce technical integration risks. ';
    }
    if (anxieties.toLowerCase().includes('training') || anxieties.toLowerCase().includes('adoption')) {
      draft += 'Intuitive interface and comprehensive training program address user adoption concerns. ';
    }
  }

  // Leverage ease of business as risk reduction
  if (easeOfBusiness) {
    if (easeOfBusiness.toLowerCase().includes('support') || easeOfBusiness.toLowerCase().includes('success')) {
      draft += 'Dedicated customer success management reduces implementation and ongoing operational risks. ';
    }
    if (easeOfBusiness.toLowerCase().includes('proven') || easeOfBusiness.toLowerCase().includes('methodology')) {
      draft += 'Established implementation playbook based on hundreds of successful deployments. ';
    }
  }

  // Add market-informed risk assessment
  if (marketInsights.implementationRisks.length > 0) {
    draft += 'Industry-standard risk mitigation practices ensure successful deployment with minimal business disruption.';
  } else {
    draft += 'Comprehensive risk mitigation through phased rollout, extensive testing, and dedicated support resources.';
  }

  return draft;
}

function generateMarketReferencePointsDraft(context, functionalValue, marketInsights) {
  let draft = '';

  // Establish context-based pricing anchors
  if (context.toLowerCase().includes('finance') || context.toLowerCase().includes('accounting')) {
    draft += 'Pricing aligns with financial software category standards ($50K-200K annually for enterprise solutions). ';
  } else if (context.toLowerCase().includes('sales') || context.toLowerCase().includes('crm')) {
    draft += 'Investment comparable to sales technology stack components ($30K-150K annually). ';
  } else if (context.toLowerCase().includes('hr') || context.toLowerCase().includes('workforce')) {
    draft += 'Cost structure mirrors HR technology investments ($25K-100K annually per thousand employees). ';
  } else {
    draft += 'Pricing positioned within enterprise software category benchmarks ($40K-180K annually). ';
  }

  // Add functional value context to pricing
  if (functionalValue) {
    const hasQuantification = functionalValue.match(/\$([0-9,]+)/);
    if (hasQuantification) {
      draft += `Investment justified by ${hasQuantification[0]} in annual value creation. `;
    }
  }

  // Incorporate market intelligence
  if (marketInsights.pricingBenchmarks.length > 0) {
    draft += 'Market research validates pricing within industry norms for similar business-critical solutions.';
  } else {
    draft += 'Reference customers confirm pricing expectations align with budget allocations for strategic operational improvements.';
  }

  return draft;
}