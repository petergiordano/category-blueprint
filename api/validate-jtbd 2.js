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
        return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
    }

    try {
        const { companyContext, jtbdElementName, userInput } = req.body;
        
        // Validate required parameters
        if (!companyContext || !jtbdElementName || !userInput) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required parameters: companyContext, jtbdElementName, or userInput.' 
            });
        }

        // Get API key from environment variables
        const apiKey = process.env.BRAVE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                success: false, 
                error: 'API configuration error: Missing BRAVE_API_KEY' 
            });
        }

        // Step 1: AI Keyword Extraction
        const extractedKeywords = extractSemanticKeywords(userInput, jtbdElementName, companyContext);
        
        // Step 2: Dynamic Query Formulation
        const queries = generateDynamicQueries(extractedKeywords, jtbdElementName, companyContext);

        // Execute searches and get aggregated results
        const searchResults = await performSearches(queries, apiKey);
        
        // Step 3: Aggregated Analysis
        const analysis = performAggregatedAnalysis(searchResults, userInput, extractedKeywords, jtbdElementName, companyContext);
        
        // Add debug information if requested (via query param or header)
        const includeDebug = req.query.debug === 'true' || req.headers['x-debug'] === 'true';
        
        const response = {
            success: true,
            ...analysis
        };
        
        if (includeDebug) {
            response.debug = {
                extractedKeywords: extractedKeywords,
                queries: queries,
                searchResultsCount: {
                    snippets: searchResults.snippets.length,
                    titles: searchResults.titles.length
                },
                sampleSnippets: searchResults.snippets.slice(0, 3),
                aggregatedCorpusLength: searchResults.snippets.join(' ').length,
                userInput: userInput,
                jtbdElement: jtbdElementName,
                companyContext: {
                    industry: companyContext.industry,
                    productName: companyContext.productName,
                    competitors: companyContext.competitorNames
                }
            };
        }
        
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error validating JTBD element:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to validate against market data.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Step 1: AI Keyword Extraction using heuristic-based semantic analysis
function extractSemanticKeywords(userInput, jtbdElementName, companyContext) {
    const { industry, productName } = companyContext;
    
    // Remove stop words and clean input
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
        'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
    ]);
    
    // Extract meaningful terms (prioritize nouns and adjectives)
    const words = userInput.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Industry-specific term weighting
    const industryTerms = getIndustryKeywords(industry);
    const keywordScores = {};
    
    words.forEach(word => {
        let score = 1;
        
        // Boost industry-specific terms
        if (industryTerms.some(term => term.includes(word) || word.includes(term))) {
            score += 3;
        }
        
        // Boost longer, more specific terms
        if (word.length > 6) score += 1;
        if (word.length > 10) score += 1;
        
        // Boost terms that appear multiple times
        keywordScores[word] = (keywordScores[word] || 0) + score;
    });
    
    // Extract 2-word phrases for more context
    for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        keywordScores[phrase] = (keywordScores[phrase] || 0) + 2;
    }
    
    // Return top 2-3 keywords/phrases
    return Object.entries(keywordScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([keyword]) => keyword);
}

// Step 2: Dynamic Query Formulation for context-aware searches
function generateDynamicQueries(extractedKeywords, jtbdElementName, companyContext) {
    const { industry, productName, competitorNames } = companyContext;
    const competitor = competitorNames?.[0] || 'competitors';
    const primaryKeyword = extractedKeywords[0] || 'business process';
    const secondaryKeyword = extractedKeywords[1] || industry;
    
    // Generate diverse search angles based on JTBD element type
    const queryStrategies = {
        problem: `"${primaryKeyword}" problems challenges issues ${industry}`,
        solution: `"${primaryKeyword}" ${secondaryKeyword} solutions best practices ${industry}`,
        discussion: `"${primaryKeyword}" ${secondaryKeyword} forum discussion reddit experiences`,
        competitive: `"${primaryKeyword}" vs ${competitor} comparison alternatives`,
        caseStudy: `"${primaryKeyword}" ${secondaryKeyword} case study ROI results success`
    };
    
    // JTBD element-specific query customization
    const elementCustomizations = {
        'Context': ['operational', 'workflow', 'business process'],
        'Struggling Moments': ['problems', 'complaints', 'failures'],
        'Pushes': ['reasons to switch', 'migration', 'transformation'],
        'Pulls': ['benefits', 'advantages', 'why choose'],
        'Anxieties': ['concerns', 'risks', 'implementation challenges'],
        'Habits': ['current practices', 'traditional approach', 'how companies'],
        'Desired Outcomes': ['ROI', 'success metrics', 'business outcomes'],
        'Basic Quality': ['requirements', 'standards', 'must-have features'],
        'Hiring Criteria': ['selection criteria', 'decision factors', 'vendor evaluation'],
        'Firing Criteria': ['deal breakers', 'reasons to leave', 'problems with'],
        'Key Trade-offs': ['limitations', 'compromises', 'acceptable trade-offs']
    };
    
    const customTerms = elementCustomizations[jtbdElementName] || ['business', 'enterprise', 'solution'];
    
    // Build final query set with element-specific enhancements
    const queries = [
        queryStrategies.problem + ` ${customTerms[0]}`,
        queryStrategies.solution + ` ${customTerms[1]}`,
        queryStrategies.discussion,
        queryStrategies.competitive + ` ${customTerms[2]}`,
        queryStrategies.caseStudy
    ];
    
    return queries.filter(query => query.length > 10); // Remove empty/invalid queries
}

function getIndustryKeywords(industry) {
    const industryKeywords = {
        'SaaS': ['subscription', 'cloud', 'API', 'integration', 'dashboard', 'platform', 'software'],
        'Software': ['platform', 'solution', 'automation', 'workflow', 'deployment', 'development'],
        'Financial Services': ['compliance', 'regulatory', 'audit', 'risk management', 'transactions', 'fintech'],
        'Healthcare': ['HIPAA', 'patient', 'clinical', 'EHR', 'medical', 'healthcare'],
        'E-commerce': ['checkout', 'cart', 'conversion', 'inventory', 'fulfillment', 'retail'],
        'Manufacturing': ['supply chain', 'production', 'quality control', 'inventory', 'logistics', 'manufacturing']
    };
    
    return industryKeywords[industry] || industryKeywords['Software'];
}

async function performSearches(queries, apiKey) {
    const searchPromises = queries.map(async (query) => {
        try {
            const searchUrl = 'https://api.search.brave.com/res/v1/web/search';
            const searchParams = new URLSearchParams({
                q: query,
                count: 5,
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
                console.error(`Search failed for query: ${query}`, response.status);
                return { snippets: [], titles: [] };
            }

            const data = await response.json();
            
            if (data.web && data.web.results) {
                return {
                    snippets: data.web.results.map(r => r.description || ''),
                    titles: data.web.results.map(r => r.title || '')
                };
            }
            
            return { snippets: [], titles: [] };
        } catch (error) {
            console.error(`Search error for query: ${query}`, error);
            return { snippets: [], titles: [] };
        }
    });

    const results = await Promise.all(searchPromises);
    
    return {
        snippets: results.flatMap(r => r.snippets).filter(s => s),
        titles: results.flatMap(r => r.titles).filter(t => t)
    };
}

// Step 3: Aggregated Analysis with enhanced intelligence
function performAggregatedAnalysis(searchResults, userInput, extractedKeywords, jtbdElementName, companyContext) {
    const { snippets, titles } = searchResults;
    
    // Create comprehensive corpus from all search results
    const aggregatedCorpus = [...snippets, ...titles].join(' ').toLowerCase();
    const userInputLower = userInput.toLowerCase();
    
    // Enhanced alignment scoring using semantic similarity
    const alignmentScore = calculateSemanticAlignment(aggregatedCorpus, userInputLower, extractedKeywords, snippets.length);
    
    // Advanced market language extraction using statistical analysis
    const marketLanguage = extractMarketLanguageAdvanced(aggregatedCorpus, userInputLower, extractedKeywords, companyContext);
    
    // Intelligent suggestions based on gap analysis between user input and market reality
    const refinementSuggestions = generateIntelligentSuggestions(
        aggregatedCorpus, userInput, extractedKeywords, marketLanguage, jtbdElementName, companyContext
    );
    
    return {
        alignmentScore,
        marketLanguage,
        refinementSuggestions
    };
}

function calculateSemanticAlignment(corpus, userInput, extractedKeywords, snippetCount) {
    if (snippetCount === 0) return 0;
    if (!corpus || corpus.length === 0) return 10;
    
    let totalScore = 0;
    const scoringFactors = [];
    
    // Factor 1: Keyword Density Analysis (40% of score)
    const keywordDensityScore = calculateKeywordDensity(corpus, extractedKeywords);
    scoringFactors.push({ factor: 'keywordDensity', score: keywordDensityScore, weight: 0.4 });
    
    // Factor 2: Semantic Context Matching (35% of score)
    const contextScore = calculateContextAlignment(corpus, userInput, extractedKeywords);
    scoringFactors.push({ factor: 'contextAlignment', score: contextScore, weight: 0.35 });
    
    // Factor 3: Market Language Overlap (25% of score)
    const marketOverlapScore = calculateMarketOverlap(corpus, userInput);
    scoringFactors.push({ factor: 'marketOverlap', score: marketOverlapScore, weight: 0.25 });
    
    // Calculate weighted score
    totalScore = scoringFactors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
    
    // Apply corpus quality adjustments
    if (snippetCount < 3) totalScore *= 0.8; // Penalty for low data volume
    if (snippetCount > 15) totalScore = Math.min(totalScore + 5, 100); // Bonus for rich data
    if (corpus.length < 500) totalScore *= 0.9; // Penalty for sparse content
    
    return Math.max(0, Math.min(100, Math.round(totalScore)));
}

function calculateKeywordDensity(corpus, extractedKeywords) {
    if (!extractedKeywords || extractedKeywords.length === 0) return 20;
    
    const corpusWords = corpus.split(/\s+/).length;
    let keywordMatches = 0;
    
    extractedKeywords.forEach(keyword => {
        const keywordRegex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+').toLowerCase()}\\b`, 'gi');
        const matches = corpus.match(keywordRegex);
        if (matches) {
            keywordMatches += matches.length;
        }
    });
    
    const density = (keywordMatches / corpusWords) * 100;
    return Math.min(100, density * 20); // Scale density to 0-100 score
}

function calculateContextAlignment(corpus, userInput, extractedKeywords) {
    const userWords = userInput.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    let alignmentMatches = 0;
    
    // Check for contextual word co-occurrence
    userWords.forEach(userWord => {
        extractedKeywords.forEach(keyword => {
            const pattern = new RegExp(`\\b${userWord}\\b.*\\b${keyword}\\b|\\b${keyword}\\b.*\\b${userWord}\\b`, 'gi');
            if (corpus.match(pattern)) {
                alignmentMatches += 2; // Higher weight for co-occurrence
            }
        });
    });
    
    // Check for synonym and related term presence
    const relatedTermsScore = checkAdvancedRelatedTerms(corpus, userInput, extractedKeywords);
    
    return Math.min(100, alignmentMatches + relatedTermsScore);
}

function calculateMarketOverlap(corpus, userInput) {
    const businessTerms = [
        'solution', 'platform', 'software', 'system', 'process', 'workflow', 
        'automation', 'efficiency', 'productivity', 'ROI', 'business', 'enterprise',
        'integration', 'performance', 'scalability', 'security', 'compliance'
    ];
    
    let overlapScore = 0;
    const userTerms = userInput.toLowerCase().split(/\s+/);
    
    businessTerms.forEach(businessTerm => {
        if (corpus.includes(businessTerm) && userTerms.some(userTerm => userTerm.includes(businessTerm))) {
            overlapScore += 5;
        } else if (corpus.includes(businessTerm)) {
            overlapScore += 2;
        }
    });
    
    return Math.min(100, overlapScore);
}

function checkAdvancedRelatedTerms(corpus, userInput, extractedKeywords) {
    const advancedRelatedConcepts = {
        'efficiency': ['streamline', 'optimize', 'automate', 'productivity', 'throughput', 'eliminate waste'],
        'cost': ['budget', 'expense', 'pricing', 'savings', 'ROI', 'cost-effective', 'value for money'],
        'integration': ['connect', 'sync', 'API', 'seamless', 'compatible', 'interoperability', 'unified'],
        'security': ['compliance', 'encryption', 'protection', 'privacy', 'secure', 'audit trail', 'governance'],
        'scale': ['growth', 'expand', 'enterprise', 'volume', 'capacity', 'scalable', 'extensible'],
        'performance': ['speed', 'fast', 'quick', 'latency', 'throughput', 'responsiveness', 'optimization'],
        'reliability': ['uptime', 'availability', 'stable', 'consistent', 'dependable', 'fault-tolerant'],
        'user experience': ['usability', 'intuitive', 'user-friendly', 'adoption', 'training', 'onboarding'],
        'analytics': ['insights', 'reporting', 'dashboard', 'metrics', 'KPI', 'visibility', 'intelligence'],
        'workflow': ['process', 'workflow', 'automation', 'orchestration', 'business rules', 'approval']
    };
    
    let conceptualScore = 0;
    const userTermsLower = userInput.toLowerCase().split(/\s+/);
    const keywordTerms = extractedKeywords.map(k => k.toLowerCase());
    
    Object.entries(advancedRelatedConcepts).forEach(([concept, synonyms]) => {
        const conceptRelevant = userTermsLower.some(term => 
            term.includes(concept) || concept.includes(term)
        ) || keywordTerms.some(keyword => 
            keyword.includes(concept) || concept.includes(keyword)
        );
        
        if (conceptRelevant) {
            synonyms.forEach(synonym => {
                if (corpus.includes(synonym.toLowerCase())) {
                    conceptualScore += 4; // Higher weight for advanced concepts
                }
            });
        }
    });
    
    return Math.min(conceptualScore, 40); // Cap bonus at 40 points
}

function extractMarketLanguageAdvanced(corpus, userInput, extractedKeywords, companyContext) {
    const { industry } = companyContext;
    
    // Enhanced stop words for business context
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
        'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
        'use', 'using', 'used', 'get', 'got', 'getting', 'make', 'making', 'made'
    ]);
    
    // Extract n-grams with statistical weighting
    const words = corpus.match(/\b[a-z]+\b/g) || [];
    const termFrequency = {};
    const phrases = {};
    
    // Single word analysis with TF-IDF-like scoring
    words.forEach((word, index) => {
        if (!stopWords.has(word) && word.length > 3) {
            termFrequency[word] = (termFrequency[word] || 0) + 1;
        }
    });
    
    // 2-gram and 3-gram extraction
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        if (!stopWords.has(word1) && !stopWords.has(word2) && 
            word1.length > 2 && word2.length > 2) {
            const bigram = `${word1} ${word2}`;
            phrases[bigram] = (phrases[bigram] || 0) + 1;
            
            // 3-grams
            if (i < words.length - 2) {
                const word3 = words[i + 2];
                if (!stopWords.has(word3) && word3.length > 2) {
                    const trigram = `${word1} ${word2} ${word3}`;
                    phrases[trigram] = (phrases[trigram] || 0) + 1;
                }
            }
        }
    }
    
    // Industry-specific term weighting
    const industryTerms = getIndustryKeywords(industry);
    const enhancedTerms = {};
    
    Object.entries(termFrequency).forEach(([term, frequency]) => {
        let weight = frequency;
        // Boost industry-specific terms
        if (industryTerms.some(industryTerm => 
            term.includes(industryTerm.toLowerCase()) || industryTerm.toLowerCase().includes(term))) {
            weight += 5;
        }
        // Boost longer, more specific terms
        if (term.length > 8) weight += 2;
        enhancedTerms[term] = weight;
    });
    
    Object.entries(phrases).forEach(([phrase, frequency]) => {
        let weight = frequency + 1; // Phrases get base bonus
        if (industryTerms.some(industryTerm => phrase.includes(industryTerm.toLowerCase()))) {
            weight += 3;
        }
        enhancedTerms[phrase] = weight;
    });
    
    // Filter out user input terms and sort by weighted frequency
    const marketLanguage = Object.entries(enhancedTerms)
        .filter(([term, weight]) => 
            weight > 1 && 
            !userInput.toLowerCase().includes(term) &&
            !extractedKeywords.some(keyword => keyword.toLowerCase().includes(term))
        )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([term]) => term);
    
    return marketLanguage.length > 0 ? marketLanguage : 
           [`${industry.toLowerCase()} solution`, 'enterprise platform', 'business automation'];
}

// Legacy function - keeping for backward compatibility, will be removed in cleanup

function generateIntelligentSuggestions(corpus, userInput, extractedKeywords, marketLanguage, jtbdElementName, companyContext) {
    const { industry, productName } = companyContext;
    const suggestions = [];
    
    // Gap analysis between user input and market reality
    const marketGaps = analyzeMarketGaps(corpus, userInput, extractedKeywords, marketLanguage);
    
    // Element-specific intelligent suggestions based on market data
    const intelligentElementSuggestions = {
        'Context': generateContextSuggestions(marketGaps, industry, corpus),
        'Struggling Moments': generateStrugglingSuggestions(marketGaps, industry, corpus),
        'Pushes': generatePushesSuggestions(marketGaps, industry, corpus),
        'Pulls': generatePullsSuggestions(marketGaps, industry, corpus),
        'Anxieties': generateAnxietiesSuggestions(marketGaps, industry, corpus),
        'Habits': generateHabitsSuggestions(marketGaps, industry, corpus),
        'Desired Outcomes': generateOutcomesSuggestions(marketGaps, industry, corpus),
        'Basic Quality': generateQualitySuggestions(marketGaps, industry, corpus),
        'Hiring Criteria': generateHiringSuggestions(marketGaps, industry, corpus),
        'Firing Criteria': generateFiringSuggestions(marketGaps, industry, corpus),
        'Key Trade-offs': generateTradeoffsSuggestions(marketGaps, industry, corpus)
    };
    
    // Get contextual suggestions for this JTBD element
    const contextualSuggestions = intelligentElementSuggestions[jtbdElementName] || 
        generateGenericSuggestions(marketGaps, industry);
    
    // Add market terminology suggestions if gap identified
    if (marketLanguage.length > 0 && marketGaps.terminologyGap > 0.5) {
        suggestions.push(`Market uses "${marketLanguage[0]}" and "${marketLanguage[1] || marketLanguage[0]}" - consider incorporating these terms`);
    }
    
    // Add specificity suggestions based on market data density
    if (marketGaps.specificityGap > 0.6) {
        suggestions.push(`Add more specific details - market data shows emphasis on ${marketLanguage.slice(0, 2).join(' and ')}`);
    }
    
    // Add context-specific suggestions
    suggestions.push(...contextualSuggestions.slice(0, 2));
    
    return suggestions.slice(0, 3);
}

function analyzeMarketGaps(corpus, userInput, extractedKeywords, marketLanguage) {
    const userWords = userInput.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const corpusWords = corpus.split(/\s+/).filter(w => w.length > 2);
    
    // Calculate terminology gap
    const marketTermsInUserInput = marketLanguage.filter(term => 
        userInput.toLowerCase().includes(term.toLowerCase())
    ).length;
    const terminologyGap = 1 - (marketTermsInUserInput / Math.max(marketLanguage.length, 1));
    
    // Calculate specificity gap based on corpus richness vs user input
    const specificityGap = Math.max(0, 1 - (userWords.length / 20)); // Assume 20 words is good specificity
    
    // Calculate context gap - how well user input aligns with market discussions
    const userKeywordDensity = extractedKeywords.filter(keyword => 
        corpus.includes(keyword.toLowerCase())
    ).length / Math.max(extractedKeywords.length, 1);
    const contextGap = 1 - userKeywordDensity;
    
    return {
        terminologyGap,
        specificityGap,
        contextGap,
        marketTermsFound: marketTermsInUserInput,
        corpusRichness: corpusWords.length > 500 ? 'high' : corpusWords.length > 200 ? 'medium' : 'low'
    };
}

function generateContextSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (gaps.specificityGap > 0.5) {
        suggestions.push(`Add specific ${industry} processes, systems, or workflows`);
    }
    if (gaps.contextGap > 0.6) {
        suggestions.push('Include measurable business metrics or operational KPIs');
    }
    suggestions.push('Reference current tools, systems, or processes being used');
    return suggestions;
}

function generateStrugglingSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (gaps.terminologyGap > 0.5) {
        suggestions.push('Use industry-standard terminology to describe pain points');
    }
    if (gaps.specificityGap > 0.5) {
        suggestions.push('Specify frequency, impact, or cost of this struggle');
    }
    suggestions.push('Include emotional or business consequences of the problem');
    return suggestions;
}

function generateOutcomesSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (corpus.includes('roi') || corpus.includes('return') || corpus.includes('savings')) {
        suggestions.push('Add quantifiable metrics like ROI, cost savings, or efficiency gains');
    }
    if (gaps.specificityGap > 0.5) {
        suggestions.push('Include specific time frames and success metrics');
    }
    suggestions.push('Specify measurable business impact expectations');
    return suggestions;
}

function generateGenericSuggestions(gaps, industry) {
    const suggestions = [];
    if (gaps.specificityGap > 0.7) {
        suggestions.push(`Add more ${industry}-specific details and context`);
    }
    if (gaps.terminologyGap > 0.6) {
        suggestions.push('Use industry-standard terminology and best practices');
    }
    suggestions.push('Include measurable outcomes and success criteria');
    return suggestions;
}

// Additional suggestion functions for remaining JTBD elements
function generatePushesSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (corpus.includes('migration') || corpus.includes('switch')) {
        suggestions.push('Include specific migration or switching triggers');
    }
    suggestions.push('Reference compelling events or business drivers');
    return suggestions;
}

function generatePullsSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (corpus.includes('benefits') || corpus.includes('advantages')) {
        suggestions.push('Highlight unique advantages and competitive benefits');
    }
    suggestions.push('Specify value proposition and differentiation factors');
    return suggestions;
}

function generateAnxietiesSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (gaps.specificityGap > 0.5) {
        suggestions.push('Address specific implementation or adoption concerns');
    }
    suggestions.push('Include risk mitigation strategies or proof points');
    return suggestions;
}

function generateHabitsSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    suggestions.push('Describe current practices and traditional approaches');
    suggestions.push('Reference existing tools, processes, or workflows');
    return suggestions;
}

function generateQualitySuggestions(gaps, industry, corpus) {
    const suggestions = [];
    if (corpus.includes('compliance') || corpus.includes('standards')) {
        suggestions.push('Reference specific compliance or security standards');
    }
    suggestions.push('Include must-have features and technical requirements');
    return suggestions;
}

function generateHiringSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    suggestions.push('Add decision-making criteria and evaluation factors');
    suggestions.push('Include budget considerations and ROI expectations');
    return suggestions;
}

function generateFiringSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    suggestions.push('Specify deal-breakers and non-negotiable issues');
    suggestions.push('Include specific problems or limitations');
    return suggestions;
}

function generateTradeoffsSuggestions(gaps, industry, corpus) {
    const suggestions = [];
    suggestions.push('Acknowledge acceptable limitations or compromises');
    suggestions.push('Balance feature trade-offs with business priorities');
    return suggestions;
}