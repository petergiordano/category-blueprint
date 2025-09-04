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
    const { fromStatement, toStatement, newOpportunity, positioningContext } = req.body;

    if (!fromStatement || !toStatement || !newOpportunity) {
      return res.status(400).json({ error: 'Point of View data (from/to statements and new opportunity) is required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Create comprehensive category-focused search queries
    const searchQueries = [
      `"${fromStatement}" category design naming industry trends`,
      `"${toStatement}" market category definition competitive landscape`,
      `"${newOpportunity}" business category naming conventions examples`,
      'B2B software category names market categories technology naming',
      'business category design methodology market category creation',
      'technology category naming trends software industry categories'
    ];

    // Execute searches to gather category intelligence
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
        console.log(`Category search query failed: ${query}`);
        // Continue with other queries even if one fails
      }
    }

    // Analyze context and generate category drafts
    const categoryDrafts = generateCategoryDrafts(fromStatement, toStatement, newOpportunity, positioningContext, searchResults);

    return res.status(200).json({
      success: true,
      drafts: categoryDrafts,
      context: {
        pointOfViewAnalyzed: true,
        positioningContextUsed: !!positioningContext,
        researchSources: searchResults.length
      }
    });

  } catch (error) {
    console.error('Category drafting error:', error);
    return res.status(500).json({ 
      error: 'AI drafting service temporarily unavailable',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function generateCategoryDrafts(fromStatement, toStatement, newOpportunity, positioningContext, searchResults) {
  // Extract key insights from Point of View statements
  const fromInsights = extractKeyInsights(fromStatement);
  const toInsights = extractKeyInsights(toStatement);
  const opportunityInsights = extractKeyInsights(newOpportunity);
  
  // Analyze search results for category naming patterns
  const categoryIntelligence = extractCategoryIntelligence(searchResults);
  
  // Generate category name and definition based on combined intelligence
  const categoryName = generateCategoryName(fromInsights, toInsights, opportunityInsights, categoryIntelligence, positioningContext);
  const categoryDefinition = generateCategoryDefinition(fromStatement, toStatement, newOpportunity, categoryName, categoryIntelligence, positioningContext);

  return {
    categoryName,
    categoryDefinition
  };
}

function extractKeyInsights(statement) {
  const insights = {
    keywords: [],
    concepts: [],
    problems: [],
    solutions: []
  };

  if (!statement) return insights;

  const lowercaseStatement = statement.toLowerCase();
  
  // Extract technology-related keywords
  const techKeywords = ['ai', 'artificial intelligence', 'machine learning', 'automation', 'digital', 'platform', 'cloud', 'data', 'analytics', 'intelligence', 'smart', 'predictive', 'continuous', 'real-time', 'scalable', 'integrated'];
  insights.keywords = techKeywords.filter(keyword => lowercaseStatement.includes(keyword));
  
  // Extract business concepts
  const businessConcepts = ['transformation', 'optimization', 'efficiency', 'growth', 'innovation', 'strategy', 'operations', 'performance', 'value', 'competitive', 'market', 'customer', 'revenue', 'process', 'workflow'];
  insights.concepts = businessConcepts.filter(concept => lowercaseStatement.includes(concept));
  
  // Extract problem indicators
  const problemWords = ['manual', 'reactive', 'slow', 'inefficient', 'costly', 'error', 'fragmented', 'disconnected', 'outdated', 'complex'];
  insights.problems = problemWords.filter(problem => lowercaseStatement.includes(problem));
  
  // Extract solution indicators  
  const solutionWords = ['automated', 'proactive', 'fast', 'efficient', 'streamlined', 'integrated', 'unified', 'intelligent', 'optimized', 'enhanced'];
  insights.solutions = solutionWords.filter(solution => lowercaseStatement.includes(solution));

  return insights;
}

function extractCategoryIntelligence(searchResults) {
  const intelligence = {
    namingPatterns: [],
    industryTerms: [],
    competitiveCategories: []
  };

  searchResults.forEach(result => {
    const title = (result.title || '').toLowerCase();
    const description = (result.description || '').toLowerCase();
    const content = title + ' ' + description;

    // Extract common naming patterns
    const patterns = content.match(/(\w+\s+\w+\s+(platform|solution|system|engine|suite|framework|intelligence|automation|optimization))/gi) || [];
    intelligence.namingPatterns.push(...patterns.slice(0, 3));

    // Extract industry-specific terms
    const industryTerms = content.match(/(enterprise|business|operational|strategic|intelligent|predictive|continuous|adaptive|dynamic)\s+\w+/gi) || [];
    intelligence.industryTerms.push(...industryTerms.slice(0, 2));

    // Extract competitive category mentions
    const categoryMentions = content.match(/(\w+\s+\w+\s+(category|market|space|segment|vertical))/gi) || [];
    intelligence.competitiveCategories.push(...categoryMentions.slice(0, 2));
  });

  return intelligence;
}

function generateCategoryName(fromInsights, toInsights, opportunityInsights, categoryIntelligence, positioningContext) {
  // Combine insights to create category name components
  const allKeywords = [...fromInsights.keywords, ...toInsights.keywords, ...opportunityInsights.keywords];
  const allConcepts = [...fromInsights.concepts, ...toInsights.concepts, ...opportunityInsights.concepts];
  const allSolutions = [...fromInsights.solutions, ...toInsights.solutions, ...opportunityInsights.solutions];

  // Prioritize key technological and business themes
  let primaryTech = '';
  let primaryConcept = '';

  // Select primary technology theme
  if (allKeywords.includes('ai') || allKeywords.includes('artificial intelligence')) {
    primaryTech = 'AI-Powered';
  } else if (allKeywords.includes('intelligent') || allKeywords.includes('smart')) {
    primaryTech = 'Intelligent';
  } else if (allKeywords.includes('predictive')) {
    primaryTech = 'Predictive';
  } else if (allKeywords.includes('continuous') || allKeywords.includes('real-time')) {
    primaryTech = 'Continuous';
  } else if (allKeywords.includes('automation') || allSolutions.includes('automated')) {
    primaryTech = 'Automated';
  } else if (allKeywords.includes('adaptive')) {
    primaryTech = 'Adaptive';
  } else {
    primaryTech = 'Strategic';
  }

  // Select primary business concept
  if (allConcepts.includes('transformation')) {
    primaryConcept = 'Transformation';
  } else if (allConcepts.includes('optimization')) {
    primaryConcept = 'Optimization';
  } else if (allConcepts.includes('operations')) {
    primaryConcept = 'Operations';
  } else if (allConcepts.includes('performance')) {
    primaryConcept = 'Performance';
  } else if (allConcepts.includes('growth')) {
    primaryConcept = 'Growth';
  } else if (allConcepts.includes('strategy')) {
    primaryConcept = 'Strategy';
  } else if (allConcepts.includes('process')) {
    primaryConcept = 'Process Excellence';
  } else {
    primaryConcept = 'Business Intelligence';
  }

  // Use positioning context if available for additional refinement
  let contextualModifier = '';
  if (positioningContext && positioningContext.icpSummary) {
    const icpLower = positioningContext.icpSummary.toLowerCase();
    if (icpLower.includes('enterprise')) {
      contextualModifier = 'Enterprise ';
    } else if (icpLower.includes('mid-market')) {
      contextualModifier = 'Mid-Market ';
    }
  }

  // Generate final category name
  return `${contextualModifier}${primaryTech} ${primaryConcept}`;
}

function generateCategoryDefinition(fromStatement, toStatement, newOpportunity, categoryName, categoryIntelligence, positioningContext) {
  let definition = '';

  // Start with the transformation insight
  if (fromStatement && toStatement) {
    // Extract the core transformation
    const fromCore = fromStatement.replace(/^(From|The old way|Previously|Traditional|Legacy)\s*/i, '').trim();
    const toCore = toStatement.replace(/^(To|The new way|Now|Modern|Advanced)\s*/i, '').trim();
    
    definition = `The practice of transforming business operations from ${fromCore.toLowerCase()} to ${toCore.toLowerCase()}`;
  } else {
    definition = `The practice of ${categoryName.toLowerCase()}`;
  }

  // Add the opportunity context
  if (newOpportunity) {
    const opportunityCore = newOpportunity.replace(/^(What becomes possible|The opportunity|This enables|Businesses can now)\s*/i, '').trim();
    definition += `, enabling ${opportunityCore.toLowerCase()}`;
  }

  // Incorporate intelligence from search results if available
  if (categoryIntelligence.industryTerms.length > 0) {
    const relevantTerm = categoryIntelligence.industryTerms[0];
    if (relevantTerm && !definition.toLowerCase().includes(relevantTerm.toLowerCase())) {
      definition += ` through ${relevantTerm.toLowerCase()}`;
    }
  }

  // Add positioning context if available
  if (positioningContext && positioningContext.valueProps && positioningContext.valueProps.length > 0) {
    const primaryValue = positioningContext.valueProps[0];
    if (primaryValue && primaryValue.length > 20) {
      // Extract key benefit without being too verbose
      const valueSummary = primaryValue.split('.')[0]; // Take first sentence
      if (valueSummary.length < 100) {
        definition += ` to ${valueSummary.toLowerCase()}`;
      }
    }
  }

  // Ensure definition ends with a period and isn't too long
  definition = definition.trim();
  if (!definition.endsWith('.')) {
    definition += '.';
  }

  // Cap definition length at reasonable limit
  if (definition.length > 200) {
    const sentences = definition.split('.');
    definition = sentences[0] + '.';
  }

  return definition;
}