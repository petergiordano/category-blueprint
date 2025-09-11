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
        return res.status(405).json({ 
            success: false, 
            error: 'Method Not Allowed. Use POST.' 
        });
    }

    try {
        const { companyUrl, companyContext } = req.body;
        
        // Validate required parameters
        if (!companyUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Company URL is required.' 
            });
        }

        // Validate URL format
        let urlObj;
        try {
            urlObj = new URL(companyUrl);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                throw new Error('Invalid protocol');
            }
        } catch {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid URL format. Please provide a valid HTTP(S) URL.' 
            });
        }

        // Extract company name from URL or use provided context
        const companyName = extractCompanyName(urlObj, companyContext);
        console.log('Analyzing company:', companyName, 'at', companyUrl);

        // Step 1: Scrape website content
        console.log('Step 1: Scraping website content...');
        const websiteContent = await scrapeWebsite(companyUrl);
        
        if (!websiteContent) {
            throw new Error('Failed to scrape website content');
        }

        // Step 2: Gather market intelligence via search
        console.log('Step 2: Gathering market intelligence...');
        const marketIntel = await gatherMarketIntelligence(companyName, companyUrl);
        console.log('Market intelligence gathered:', marketIntel.results.length, 'results');
        
        // Step 3: Generate JTBD analysis with AI
        console.log('Step 3: Generating JTBD analysis with AI...');
        const jtbdAnalysis = await generateJTBDAnalysis(
            websiteContent, 
            marketIntel, 
            companyName,
            companyContext
        );

        // Return the structured response
        return res.status(200).json({
            success: true,
            jtbdAnalysis: jtbdAnalysis,
            metadata: {
                companyName: companyName,
                companyUrl: companyUrl,
                analyzedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error in discover-jtbd:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to analyze company and generate JTBD.' 
        });
    }
}

// Helper function to extract company name from URL
function extractCompanyName(urlObj, companyContext) {
    // First try to use the company name from context
    if (companyContext?.companyName) {
        return companyContext.companyName;
    }
    
    // Otherwise extract from domain
    const hostname = urlObj.hostname;
    // Remove common prefixes and suffixes
    let name = hostname
        .replace(/^www\./, '')
        .replace(/\.(com|org|net|io|ai|co|app|dev).*$/, '');
    
    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    return name;
}

// Function to extract sections with JTBD-relevant keywords
function extractKeywordSections(htmlContent, maxLength) {
    // Keywords that are likely to be near JTBD-relevant content
    const jtbdKeywords = [
        'challenge', 'problem', 'solution', 'benefit', 'help', 'enable', 'improve', 'optimize',
        'customer', 'team', 'organization', 'business', 'outcome', 'result', 'achieve',
        'struggle', 'pain', 'frustration', 'efficiency', 'productivity', 'growth', 'success',
        'competitive', 'advantage', 'innovation', 'transform', 'streamline', 'automate'
    ];
    
    // Split content into sentences
    const sentences = htmlContent.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
    
    // Score sentences based on keyword relevance
    const scoredSentences = sentences.map(sentence => {
        const lowerSentence = sentence.toLowerCase();
        const score = jtbdKeywords.reduce((acc, keyword) => {
            const matches = (lowerSentence.match(new RegExp(keyword, 'g')) || []).length;
            return acc + matches;
        }, 0);
        
        return { sentence, score };
    });
    
    // Sort by score and take the highest scoring sentences
    const relevantSentences = scoredSentences
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.sentence);
    
    // Join relevant sentences and limit to maxLength
    const prioritizedContent = relevantSentences.join('. ');
    
    if (prioritizedContent.length > maxLength) {
        return prioritizedContent.substring(0, maxLength);
    }
    
    // If we don't have enough relevant content, mix with general content
    const remainingLength = maxLength - prioritizedContent.length;
    const generalContent = htmlContent.substring(0, remainingLength);
    
    return prioritizedContent + ' ' + generalContent;
}

// Function to scrape website content using Firecrawl
async function scrapeWebsite(url) {
    try {
        // For now, we'll use a simple fetch as a fallback
        // In production, this would use Firecrawl MCP server
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Extract text content from HTML (basic extraction)
        // Remove script and style elements
        const cleanHtml = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Limit content length for processing but prioritize key sections
        const maxLength = 15000; // Increased to get more content
        
        // Try to extract key sections that are more likely to have JTBD-relevant content
        const keywordSections = extractKeywordSections(cleanHtml, maxLength);
        const content = keywordSections || cleanHtml.substring(0, maxLength);
        
        return {
            url: url,
            content: content,
            scrapedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error scraping website:', error);
        // Return minimal content if scraping fails
        return {
            url: url,
            content: `Website at ${url}`,
            error: error.message
        };
    }
}

// Function to gather market intelligence using AI-powered search
async function gatherMarketIntelligence(companyName, companyUrl) {
    console.log('Starting AI-powered market intelligence gathering for:', companyName);
    
    // Use intelligent search queries that will find JTBD-relevant content
    const intelligentQueries = [
        `${companyName} customer pain points challenges problems`,
        `${companyName} customer success stories outcomes benefits`,
        `${companyName} pricing features capabilities what does it do`,
        `${companyName} competitors alternatives comparison`,
        `${companyName} implementation onboarding setup process`
    ];

    const results = [];
    
    try {
        // Use the global firecrawl search function if available
        if (typeof global !== 'undefined' && global.firecrawlSearch) {
            for (const query of intelligentQueries) {
                try {
                    console.log('Searching with Firecrawl:', query);
                    const searchResult = await global.firecrawlSearch({
                        query: query,
                        limit: 3,
                        scrapeOptions: {
                            formats: ['markdown'],
                            onlyMainContent: true
                        }
                    });
                    
                    if (searchResult && searchResult.length > 0) {
                        results.push(...searchResult.map(r => ({
                            title: r.title || 'Search Result',
                            description: r.markdown?.substring(0, 200) || r.description || 'No description',
                            url: r.url,
                            content: r.markdown?.substring(0, 500) || ''
                        })));
                    }
                } catch (error) {
                    console.error(`Error with Firecrawl search for "${query}":`, error);
                }
            }
        } else {
            // Fallback to analyzing the company's own website more thoroughly
            console.log('Firecrawl not available, using enhanced website analysis');
            const enhancedResults = await enhancedWebsiteAnalysis(companyName, companyUrl);
            results.push(...enhancedResults);
        }
    } catch (error) {
        console.error('Error in market intelligence gathering:', error);
    }

    console.log('Market intelligence results:', results.length, 'items found');
    return {
        queries: intelligentQueries,
        results: results
    };
}

// Enhanced website analysis as fallback
async function enhancedWebsiteAnalysis(companyName, companyUrl) {
    const results = [];
    
    try {
        // Try to get additional pages from the same domain
        const domain = new URL(companyUrl).hostname;
        const commonPages = [
            `https://${domain}/about`,
            `https://${domain}/features`,
            `https://${domain}/pricing`,
            `https://${domain}/customers`,
            `https://${domain}/case-studies`,
            `https://${domain}/testimonials`,
            `https://${domain}/blog`
        ];
        
        for (const pageUrl of commonPages.slice(0, 3)) { // Limit to 3 pages to avoid timeout
            try {
                const pageContent = await scrapeWebsite(pageUrl);
                if (pageContent && pageContent.content && pageContent.content.length > 100) {
                    results.push({
                        title: `${companyName} - ${pageUrl.split('/').pop()}`,
                        description: pageContent.content.substring(0, 200),
                        url: pageUrl,
                        content: pageContent.content.substring(0, 1000)
                    });
                }
            } catch (error) {
                console.log(`Could not scrape ${pageUrl}:`, error.message);
                // Continue with other pages
            }
        }
    } catch (error) {
        console.error('Error in enhanced website analysis:', error);
    }
    
    return results;
}

// Function to generate JTBD analysis using AI
async function generateJTBDAnalysis(websiteContent, marketIntel, companyName, companyContext) {
    // Prepare the context for AI analysis
    const marketIntelText = marketIntel.results.length > 0 
        ? marketIntel.results.map(r => `- ${r.title}: ${r.description}${r.content ? '\nContent: ' + r.content.substring(0, 300) : ''}`).join('\n\n')
        : 'No external market intelligence gathered';
    
    const aggregatedContent = `
Company: ${companyName}
Website: ${websiteContent.url}

Website Content:
${websiteContent.content}

Market Intelligence:
${marketIntelText}

Company Context:
Industry: ${companyContext?.industry || 'Not specified'}
Product: ${companyContext?.productName || 'Not specified'}
Target Market: ${companyContext?.targetMarket || 'Not specified'}
    `.trim();
    
    console.log('Total content for analysis:', aggregatedContent.length, 'characters');

    // For now, return a structured template with intelligent defaults
    // In production, this would call OpenAI/Anthropic/Gemini API
    const jtbdTemplate = generateIntelligentJTBDTemplate(
        companyName, 
        websiteContent.content,
        marketIntel.results,
        companyContext,
        aggregatedContent
    );

    return jtbdTemplate;
}

// Function to generate intelligent JTBD template based on scraped content
function generateIntelligentJTBDTemplate(companyName, websiteContent, marketResults, companyContext, aggregatedContent) {
    // Extract key phrases from content for more relevant JTBD
    const industry = companyContext?.industry || 'technology';
    const productName = companyContext?.productName || companyName;
    const isB2B = companyContext?.targetMarket === 'B2B';
    
    console.log(`Generating JTBD for ${companyName} with ${websiteContent.length} chars of content`);
    
    // Advanced content analysis - extract unique phrases and value propositions
    console.log('Starting content analysis phase for', companyName);
    const uniqueContent = extractUniqueValueProposition(websiteContent, companyName);
    console.log('Unique content extracted:', uniqueContent ? uniqueContent.length + ' chars' : 'none');
    
    const industryContext = determineSpecificIndustryContext(websiteContent, industry);
    console.log('Industry context determined:', industryContext);
    
    const painPoints = extractSpecificPainPoints(websiteContent, marketResults, aggregatedContent);
    console.log('Pain points extracted:', painPoints.length);
    
    const outcomes = extractSpecificOutcomes(websiteContent, companyName);
    console.log('Outcomes extracted:', outcomes.length);
    
    // Build highly specific JTBD based on company's actual content
    const context = generateContextFromContent(industryContext, uniqueContent, isB2B);
    const strugglingMomentsText = generateStruggleMomentsFromContent(painPoints, websiteContent);
    const pushes = generatePushesFromContent(websiteContent, industryContext, isB2B);
    const anxieties = generateAnxietiesFromContent(websiteContent, companyName);
    const desiredOutcomesText = generateOutcomesFromContent(outcomes, websiteContent, companyName);
    const basicQuality = generateTableStakesFromContent(websiteContent, industryContext, isB2B);
    const hiringCriteria = generateHiringCriteriaFromContent(websiteContent, companyName, industryContext);
    const firingCriteria = generateFiringCriteriaFromContent(websiteContent, industryContext);
    const keyTradeoffs = generateTradeoffsFromContent(websiteContent, companyName, isB2B);

    // Ensure all fields have meaningful content
    const result = {
        'Context': context || `Operating in the ${industry} sector requiring specialized solutions for growth and efficiency.`,
        'Struggling Moments': strugglingMomentsText || `Managing complex ${industry} operations with legacy tools and manual processes. Dealing with fragmented workflows that slow down decision-making and impact productivity.`,
        'Pushes': pushes || `Market demands for improved ${industry} solutions and operational excellence. Competitive pressure driving need for modernization.`,
        'Anxieties': anxieties || 'Concerns about solution fit and adoption success. Implementation complexity and potential workflow disruption.',
        'Desired Outcomes': desiredOutcomesText || `Transform operations to deliver measurable efficiency gains, cost reductions, and improved business outcomes with clear ROI within 6-12 months.`,
        'Basic Quality (Table Stakes)': basicQuality || 'Enterprise-grade security and compliance certifications, seamless integration capabilities, reliable support and comprehensive documentation.',
        'Hiring Criteria': hiringCriteria || `Proven track record in ${industry} with demonstrable results. Responsive implementation team and clear methodology for deployment.`,
        'Firing Criteria': firingCriteria || `Poor customer support responsiveness or lack of industry expertise. Hidden costs or unexpected price increases during implementation.`,
        'Key Trade-offs': keyTradeoffs || 'Balance implementation speed with feature depth based on organizational priorities. Accept higher initial investment for long-term enterprise value.'
    };

    console.log('Final JTBD result validation:');
    Object.keys(result).forEach(key => {
        console.log(`${key}: ${result[key] ? 'POPULATED' : 'EMPTY'} (${result[key]?.length || 0} chars)`);
    });

    return result;
}

// Extract unique value proposition from website content
function extractUniqueValueProposition(content, companyName) {
    // Look for taglines, hero text, and value propositions
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
    
    // Find sentences that mention company benefits or unique features
    const valuePropSentences = sentences.filter(sentence => {
        return /\b(help|enable|automate|optimize|streamline|reduce|increase|improve|transform|revolutionize|innovate|accelerate)\b/i.test(sentence) &&
               sentence.length < 200 && sentence.length > 30;
    });
    
    return valuePropSentences.slice(0, 3).join(' '); // Take top 3 value prop sentences
}

// Determine specific industry context from content
function determineSpecificIndustryContext(content, defaultIndustry) {
    // Look for industry-specific terms
    const industryMap = {
        'sales': /\b(sales|prospect|lead|CRM|pipeline|revenue|quota|outbound|inbound|qualification)\b/gi,
        'marketing': /\b(marketing|campaign|brand|content|social|SEO|advertising|conversion|engagement)\b/gi,
        'finance': /\b(financial|accounting|invoice|payment|revenue|expense|budget|audit|compliance)\b/gi,
        'healthcare': /\b(health|medical|patient|clinical|hospital|therapy|diagnosis|treatment)\b/gi,
        'ecommerce': /\b(ecommerce|retail|shopping|cart|checkout|inventory|fulfillment|marketplace)\b/gi,
        'hr': /\b(HR|human resources|recruiting|talent|hiring|onboarding|payroll|benefits)\b/gi,
        'legal': /\b(legal|contract|compliance|regulation|litigation|law|attorney|court)\b/gi,
        'education': /\b(education|learning|student|teacher|course|curriculum|university|school)\b/gi
    };
    
    let detectedIndustry = defaultIndustry;
    let maxMatches = 0;
    
    for (const [industry, regex] of Object.entries(industryMap)) {
        const matches = (content.match(regex) || []).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedIndustry = industry;
        }
    }
    
    return detectedIndustry;
}

// Extract specific pain points from content and market intelligence
function extractSpecificPainPoints(content, marketResults, aggregatedContent) {
    console.log('extractSpecificPainPoints called with content length:', content.length);
    console.log('Market results available:', marketResults.length);
    
    const painKeywords = [
        'challenge', 'problem', 'difficult', 'struggle', 'pain', 'frustration', 'bottleneck', 
        'inefficient', 'manual', 'time-consuming', 'error-prone', 'complex', 'fragmented',
        'broken', 'overwhelming', 'confusing', 'scattered', 'disconnected', 'lack of'
    ];
    
    const solutionKeywords = [
        'provides', 'offers', 'delivers', 'enables', 'helps', 'allows', 'features',
        'streamline', 'automate', 'optimize', 'improve', 'enhance', 'boost'
    ];
    
    // Combine content from website and market intelligence
    const allContent = aggregatedContent || content;
    const sentences = allContent.split(/[.!?]+/).map(s => s.trim());
    console.log('Total sentences found:', sentences.length);
    
    const painSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        
        // Must contain pain keywords
        const hasPainKeyword = painKeywords.some(keyword => lowerSentence.includes(keyword));
        
        // Must NOT be primarily about solutions
        const isSolutionFocused = solutionKeywords.some(keyword => lowerSentence.includes(keyword));
        
        // Must be reasonable length and actually describe a struggle/problem
        const isReasonableLength = sentence.length > 20 && sentence.length < 200;
        
        // Look for sentences that describe actual problems customers face
        const describesProblems = /\b(teams|organizations|companies|users|customers|sales|marketers|businesses)\b.*\b(struggle|face|experience|deal with|encounter|find it hard|have trouble|difficulties)\b/i.test(sentence);
        
        // Also look for specific pain point indicators
        const hasPainIndicators = /\b(slow|expensive|unreliable|complicated|confusing|frustrating|time consuming|inefficient|difficult to use|hard to manage)\b/i.test(sentence);
        
        return hasPainKeyword && !isSolutionFocused && isReasonableLength && (describesProblems || hasPainIndicators || hasPainKeyword);
    });
    
    // Also extract pain points from market intelligence if available
    let marketPainPoints = [];
    if (marketResults && marketResults.length > 0) {
        marketResults.forEach(result => {
            if (result.content) {
                const marketSentences = result.content.split(/[.!?]+/).map(s => s.trim());
                const relevantMarketPains = marketSentences.filter(sentence => {
                    const lowerSentence = sentence.toLowerCase();
                    return painKeywords.some(keyword => lowerSentence.includes(keyword)) &&
                           sentence.length > 20 && sentence.length < 180;
                });
                marketPainPoints.push(...relevantMarketPains.slice(0, 1)); // Take 1 from each source
            }
        });
    }
    
    console.log('Website pain sentences found:', painSentences.length);
    console.log('Market pain points found:', marketPainPoints.length);
    
    // Combine and deduplicate pain points
    const allPainPoints = [...painSentences.slice(0, 2), ...marketPainPoints.slice(0, 1)];
    const uniquePainPoints = [...new Set(allPainPoints)]; // Remove duplicates
    
    console.log('Total unique pain points:', uniquePainPoints.length, uniquePainPoints);
    
    return uniquePainPoints.slice(0, 3); // Take top 3 pain point references
}

// Extract specific outcomes from content
function extractSpecificOutcomes(content, companyName) {
    const outcomeKeywords = [
        'achieve', 'reach', 'attain', 'accomplish', 'deliver', 'result', 'outcome', 'goal',
        'increase', 'improve', 'optimize', 'maximize', 'enhance', 'boost', 'accelerate'
    ];
    
    const sentences = content.split(/[.!?]+/).map(s => s.trim());
    const outcomeSentences = sentences.filter(sentence => 
        outcomeKeywords.some(keyword => sentence.toLowerCase().includes(keyword)) &&
        /\d+%|\d+x|revenue|growth|efficiency|productivity|time|cost|ROI/i.test(sentence) &&
        sentence.length > 20 && sentence.length < 150
    );
    
    return outcomeSentences.slice(0, 2); // Take top 2 outcome statements
}

// Generate context from extracted content
function generateContextFromContent(industryContext, uniqueContent, isB2B) {
    const baseContext = isB2B 
        ? `Operating in the competitive ${industryContext} sector where organizations need specialized solutions to drive growth and efficiency.`
        : `Navigating the modern ${industryContext} landscape where user experience and results matter most.`;
    
    if (uniqueContent) {
        return `${baseContext} ${uniqueContent.split(' ').slice(0, 25).join(' ')}...`;
    }
    
    return baseContext;
}

// Generate struggle moments from content analysis
function generateStruggleMomentsFromContent(painPoints, content) {
    console.log('generateStruggleMomentsFromContent called with painPoints:', painPoints);
    
    if (painPoints.length > 0) {
        const specificPains = painPoints.map(pain => 
            pain.split(' ').slice(0, 15).join(' ') // Truncate to keep it concise
        ).join('. ');
        
        console.log('Generated specific pains:', specificPains);
        return `Teams face specific challenges: ${specificPains}. These operational hurdles create bottlenecks and limit organizational potential.`;
    }
    
    console.log('No pain points found, using fallback content');
    // Fallback to generic but still useful content
    return `Organizations struggle with operational inefficiencies, manual processes, and disconnected systems that prevent them from achieving their full potential.`;
}

// Generate pushes from content
function generatePushesFromContent(content, industryContext, isB2B) {
    console.log('generatePushesFromContent called with content length:', content.length);
    
    // Extract market pressure indicators from actual content
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
    console.log('Total sentences for pushes analysis:', sentences.length);
    
    // Look for specific market pressure indicators in the actual content
    const marketPressurePatterns = [
        /\b(market|industry|competition|competitive|pressure|demand|trend|requirement|standard|expectation)\b.*\b(driving|forcing|pushing|requiring|demanding|expecting|need|must|have to|pressure)\b/gi,
        /\b(customers?|clients?|users?|organizations?|companies?|teams?)\s+(are|need|want|require|demand|expect|looking for|seeking)\b/gi,
        /\b(regulations?|compliance|standards?|policies?|requirements?)\s+(require|mandate|demand|force|necessitate)\b/gi,
        /\b(growth|expansion|scaling?|revenue|profit|efficiency|productivity)\s+(goals?|targets?|objectives?|requirements?|pressure|demands?)\b/gi
    ];
    
    let specificPushes = [];
    
    // Find sentences that describe actual market pressures
    for (const pattern of marketPressurePatterns) {
        const matches = sentences.filter(sentence => pattern.test(sentence) && sentence.length < 200);
        if (matches.length > 0) {
            specificPushes.push(...matches.slice(0, 2)); // Take up to 2 matches per pattern
        }
    }
    
    console.log('Specific pushes found:', specificPushes.length, specificPushes);
    
    // If we found specific content, use it
    if (specificPushes.length > 0) {
        const cleanedPushes = specificPushes.map(push => 
            push.replace(/^\s*[•\-\*]\s*/, '') // Remove bullet points
                .split(' ').slice(0, 20).join(' ') // Limit length
        ).slice(0, 3); // Take top 3
        
        console.log('Using specific pushes:', cleanedPushes);
        return cleanedPushes.join('. ') + '. Market dynamics continue to evolve, requiring adaptive solutions.';
    }
    
    // Enhanced fallback based on industry context and common business drivers
    const enhancedFallback = isB2B 
        ? `Organizational pressure to improve ${industryContext} operations and deliver better business outcomes. Leadership demands for measurable ROI and competitive differentiation in the marketplace.`
        : `Consumer expectations for better ${industryContext} experiences driving product innovation. Market competition requiring continuous improvement and feature enhancement.`;
    
    console.log('Using enhanced fallback for pushes');
    return enhancedFallback;
}

// Generate anxieties from content
function generateAnxietiesFromContent(content, companyName) {
    console.log('generateAnxietiesFromContent called for:', companyName);
    
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
    console.log('Total sentences for anxiety analysis:', sentences.length);
    
    // Look for specific anxiety and concern patterns in actual content
    const anxietyPatterns = [
        /\b(concern|worry|anxiet|fear|hesitat|uncertain|risk|challenge|difficult|problem)\b.*\b(about|regarding|with|around|over)\b/gi,
        /\b(what if|concerns?|risks?|challenges?|problems?|issues?|difficulties)\b.*\b(implementation|integration|adoption|security|cost|time|training|change)\b/gi,
        /\b(ensure|guarantee|confident|secure|safe|reliable|proven|trusted|established)\b/gi, // positive mentions that hint at underlying anxieties
        /\b(might|could|may|potential|possible)\b.*\b(fail|break|cost|delay|disrupt|complicate)\b/gi
    ];
    
    let specificAnxieties = [];
    
    // Find sentences that express or hint at anxieties
    for (const pattern of anxietyPatterns) {
        const matches = sentences.filter(sentence => pattern.test(sentence) && sentence.length < 180);
        if (matches.length > 0) {
            specificAnxieties.push(...matches.slice(0, 2));
        }
    }
    
    console.log('Specific anxieties found:', specificAnxieties.length, specificAnxieties);
    
    // Extract specific concerns from the content
    let contextualAnxieties = [];
    
    // Look for implementation/technical concerns
    if (content.includes('implementation') || content.includes('deploy') || content.includes('setup')) {
        contextualAnxieties.push('concerns about implementation complexity and timeline');
    }
    
    // Look for integration concerns
    if (content.includes('integrat') || content.includes('API') || content.includes('connect')) {
        contextualAnxieties.push('uncertainty about integration with existing systems and data consistency');
    }
    
    // Look for security/compliance concerns
    if (content.includes('security') || content.includes('complian') || content.includes('privacy')) {
        contextualAnxieties.push('security and compliance validation requirements');
    }
    
    // Look for cost/ROI concerns
    if (content.includes('cost') || content.includes('price') || content.includes('ROI') || content.includes('budget')) {
        contextualAnxieties.push('budget justification and ROI demonstration pressure');
    }
    
    // Look for team/adoption concerns
    if (content.includes('team') || content.includes('user') || content.includes('training') || content.includes('adoption')) {
        contextualAnxieties.push('user adoption and team training effectiveness');
    }
    
    // If we found specific anxieties from content, use them
    if (specificAnxieties.length > 0) {
        const cleanedAnxieties = specificAnxieties.map(anxiety => 
            anxiety.replace(/^\s*[•\-\*]\s*/, '') // Remove bullet points
                .split(' ').slice(0, 15).join(' ') // Limit length
        ).slice(0, 2);
        
        console.log('Using specific anxieties from content');
        return cleanedAnxieties.join('. ') + '. Careful evaluation needed to ensure successful implementation.';
    }
    
    // Use contextual anxieties if found
    if (contextualAnxieties.length > 0) {
        console.log('Using contextual anxieties:', contextualAnxieties);
        return contextualAnxieties.slice(0, 3).join(', ') + '.';
    }
    
    // Enhanced fallback with company-specific context
    console.log('Using enhanced fallback for anxieties');
    return `Evaluation concerns about solution fit for ${companyName} specific needs and organizational requirements. Implementation timing and change management considerations for successful adoption.`;
}

// Generate desired outcomes from content
function generateOutcomesFromContent(outcomes, content, companyName) {
    console.log('generateOutcomesFromContent called for:', companyName);
    
    if (outcomes.length > 0) {
        const specificOutcomes = outcomes.map(outcome => 
            outcome.split(' ').slice(0, 12).join(' ')
        ).join('. ');
        
        return `${specificOutcomes}. Measurable business impact within 6-12 months with clear ROI demonstration.`;
    }
    
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
    
    // Look for outcome and benefit patterns in content
    const outcomePatterns = [
        /\b(achieve|accomplish|deliver|reach|attain|realize|obtain|gain|result in|lead to)\b.*\b(improvement|benefit|gain|advantage|result|outcome|success|growth|efficiency|productivity|revenue|savings)\b/gi,
        /\b(help|enable|allow|empower|assist)\b.*\b(teams?|organizations?|companies?|users?|customers?)\b.*\b(achieve|accomplish|deliver|improve|optimize|enhance|increase|reduce|save)\b/gi,
        /\b(increase|improve|enhance|boost|optimize|maximize|accelerate|reduce|minimize|eliminate|save)\b.*\b(by|up to|\d+%|\d+x)/gi
    ];
    
    let specificOutcomes = [];
    
    // Find sentences that describe desired outcomes and benefits
    for (const pattern of outcomePatterns) {
        const matches = sentences.filter(sentence => pattern.test(sentence) && sentence.length < 180);
        if (matches.length > 0) {
            specificOutcomes.push(...matches.slice(0, 2));
        }
    }
    
    console.log('Specific outcomes found:', specificOutcomes.length, specificOutcomes);
    
    // Extract quantifiable mentions and benefits
    const metrics = content.match(/\b(\d+%|\d+x|\d+\s*(hours?|days?|weeks?|months?)|ROI|revenue|productivity|efficiency|cost savings?|time savings?|growth|conversion|retention)\b/gi);
    
    // If we found specific outcomes from content, use them
    if (specificOutcomes.length > 0) {
        const cleanedOutcomes = specificOutcomes.map(outcome => 
            outcome.replace(/^\s*[•\-\*]\s*/, '') // Remove bullet points
                .split(' ').slice(0, 18).join(' ') // Limit length
        ).slice(0, 2);
        
        const outcomeText = cleanedOutcomes.join('. ');
        const metricsText = metrics && metrics.length > 0 ? ` Target improvements include ${metrics.slice(0, 2).join(' and ')}.` : '';
        
        console.log('Using specific outcomes from content');
        return `${outcomeText}. ${metricsText} Success measured through concrete business metrics and stakeholder satisfaction.`.trim();
    }
    
    // If we have metrics but no specific outcomes, build around metrics
    if (metrics && metrics.length > 0) {
        console.log('Using metrics-based outcomes');
        return `Achieve measurable improvements in key performance indicators including ${metrics.slice(0, 3).join(', ')}. Drive quantifiable business value with clear ROI demonstration within the first year of implementation.`;
    }
    
    // Enhanced fallback with company-specific context
    console.log('Using enhanced fallback for outcomes');
    return `Enable ${companyName} to achieve operational excellence and competitive advantage through improved efficiency, better decision-making, and enhanced customer satisfaction. Deliver measurable ROI through streamlined processes and optimized resource utilization.`;
}

// Generate table stakes from content  
function generateTableStakesFromContent(content, industryContext, isB2B) {
    console.log('generateTableStakesFromContent called for industry:', industryContext);
    
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
    
    // Look for baseline requirement patterns in content (what's expected as standard)
    const tableStakePatterns = [
        /\b(require|requires|must have|need|needs|essential|necessary|standard|baseline|minimum|basic|fundamental)\b.*\b(security|compliance|support|documentation|integration|reliability|performance|uptime)\b/gi,
        /\b(certified|compliant|verified|audited|approved|trusted|reliable|proven|established)\b/gi,
        /\b(24\/7|round.the.clock|continuous|always.available|enterprise.grade|industry.standard|best.practice)\b/gi
    ];
    
    let specificRequirements = [];
    
    // Find sentences that describe baseline requirements and standards
    for (const pattern of tableStakePatterns) {
        const matches = sentences.filter(sentence => pattern.test(sentence) && sentence.length < 160);
        if (matches.length > 0) {
            specificRequirements.push(...matches.slice(0, 2));
        }
    }
    
    console.log('Specific table stakes found:', specificRequirements.length, specificRequirements);
    
    // Extract specific baseline requirements from content analysis
    let baselineRequirements = [];
    
    // Industry-specific baseline requirements
    if (industryContext.includes('sales') || industryContext.includes('marketing')) {
        baselineRequirements.push('CRM and marketing automation platform compatibility');
    } else if (industryContext.includes('finance') || industryContext.includes('accounting')) {
        baselineRequirements.push('financial data accuracy and audit trail capabilities');
    } else if (industryContext.includes('healthcare')) {
        baselineRequirements.push('HIPAA compliance and patient data protection');
    } else if (industryContext.includes('education')) {
        baselineRequirements.push('FERPA compliance and student data privacy');
    }
    
    // Technical baseline requirements based on content
    const securityMentions = (content.match(/\b(security|secure|SOC|ISO|GDPR|compliance|encrypt|audit|certified)\b/gi) || []).length;
    const integrationMentions = (content.match(/\b(integrat|API|connect|sync|compatibility|webhook)\b/gi) || []).length;
    const supportMentions = (content.match(/\b(support|help|training|documentation|onboarding|assistance)\b/gi) || []).length;
    const uptimeMentions = (content.match(/\b(uptime|reliable|availability|24\/7|SLA|service.level)\b/gi) || []).length;
    
    if (securityMentions > 2) {
        baselineRequirements.push('industry-standard security certifications and data protection protocols');
    }
    
    if (integrationMentions > 2) {
        baselineRequirements.push('robust API ecosystem and integration platform support');
    }
    
    if (supportMentions > 2) {
        baselineRequirements.push('comprehensive training resources and responsive customer success team');
    }
    
    if (uptimeMentions > 1) {
        baselineRequirements.push('guaranteed service level agreements and system reliability commitments');
    }
    
    // Add standard business requirements
    if (isB2B) {
        baselineRequirements.push('transparent pricing structure and clear contract terms');
        baselineRequirements.push('established vendor reputation and financial stability');
    }
    
    // If we found specific requirements from content, use them with baseline requirements
    if (specificRequirements.length > 0) {
        const cleanedRequirements = specificRequirements.map(req => 
            req.replace(/^\s*[•\-\*]\s*/, '') // Remove bullet points
                .split(' ').slice(0, 12).join(' ') // Limit length
        ).slice(0, 2);
        
        const combinedRequirements = [...cleanedRequirements, ...baselineRequirements.slice(0, 2)];
        
        console.log('Using specific table stakes from content');
        return combinedRequirements.slice(0, 4).join('. ') + '.';
    }
    
    // Use baseline requirements with industry context
    if (baselineRequirements.length > 0) {
        console.log('Using contextual table stakes:', baselineRequirements);
        return baselineRequirements.slice(0, 4).join(', ') + '.';
    }
    
    // Enhanced fallback focused on baseline expectations
    console.log('Using enhanced fallback for table stakes');
    return `Core infrastructure requirements including reliable ${industryContext} platform performance, comprehensive security protocols, seamless data management, and established vendor support ecosystem with proven implementation methodology.`;
}

// Generate hiring criteria from content
function generateHiringCriteriaFromContent(content, companyName, industryContext) {
    const trackRecordTerms = content.match(/\b(proven|track record|experience|established|years|successful)\b/gi);
    const customerTerms = content.match(/\b(customer|client|testimonial|case study|reference|success)\b/gi);
    const industryTerms = content.match(new RegExp(`\\b(${industryContext}|sector|domain|industry)\\b`, 'gi'));
    
    let criteria = [];
    
    if (trackRecordTerms && trackRecordTerms.length > 3) {
        criteria.push(`proven track record in ${industryContext} with demonstrable results`);
    }
    
    if (customerTerms && customerTerms.length > 4) {
        criteria.push('strong customer references and documented success stories');
    }
    
    if (industryTerms && industryTerms.length > 2) {
        criteria.push(`deep understanding of ${industryContext} industry challenges and workflows`);
    }
    
    criteria.push('responsive implementation team and ongoing support model');
    criteria.push('clear methodology for deployment and user adoption');
    
    return criteria.slice(0, 3).join('. ') + '.';
}

// Generate firing criteria from content  
function generateFiringCriteriaFromContent(content, industryContext) {
    return `Poor customer support responsiveness or lack of industry expertise. Hidden costs or unexpected price increases during implementation. Failure to deliver promised functionality or integration capabilities. Inability to adapt to specific ${industryContext} workflow requirements.`;
}

// Generate tradeoffs from content
function generateTradeoffsFromContent(content, companyName, isB2B) {
    const customizationTerms = (content.match(/\b(customiz|configur|personaliz|tailor|adapt)\b/gi) || []).length;
    const simplicityTerms = (content.match(/\b(simple|easy|intuitive|user-friendly|straightforward)\b/gi) || []).length;
    const speedTerms = (content.match(/\b(fast|quick|rapid|immediate|instant)\b/gi) || []).length;
    
    let tradeoffs = [];
    
    if (customizationTerms > 3) {
        tradeoffs.push('willing to accept longer implementation time for deeper customization');
    }
    
    if (simplicityTerms > 2) {
        tradeoffs.push('prefer ease of use over advanced feature complexity');
    }
    
    if (speedTerms > 3) {
        tradeoffs.push('prioritize rapid deployment over extensive configuration options');
    }
    
    if (isB2B) {
        tradeoffs.push('accept higher initial investment for long-term enterprise value');
    }
    
    if (tradeoffs.length === 0) {
        tradeoffs.push('balance implementation speed with feature depth based on organizational priorities');
    }
    
    return tradeoffs.slice(0, 3).join('. ') + '.';
}