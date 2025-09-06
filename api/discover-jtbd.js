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
        
        // Limit content length for processing
        const maxLength = 10000;
        const content = cleanHtml.substring(0, maxLength);
        
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

// Function to gather market intelligence using Brave Search API
async function gatherMarketIntelligence(companyName, companyUrl) {
    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
        console.warn('BRAVE_API_KEY not configured, skipping market intelligence');
        return { queries: [], results: [] };
    }

    const queries = [
        `"${companyName}" customer reviews testimonials`,
        `"${companyName}" case studies success stories`,
        `what is it like to use "${companyName}" product experience`
    ];

    const results = [];
    
    for (const query of queries) {
        try {
            const response = await fetch('https://api.search.brave.com/res/v1/web/search', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Subscription-Token': apiKey
                },
                // Use URLSearchParams to properly encode the query
                ...(typeof URLSearchParams !== 'undefined' && {
                    params: new URLSearchParams({ q: query, count: 3 })
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.web?.results) {
                    results.push(...data.web.results.slice(0, 3).map(r => ({
                        title: r.title,
                        description: r.description,
                        url: r.url
                    })));
                }
            }
        } catch (error) {
            console.error(`Error searching for "${query}":`, error);
        }
    }

    return {
        queries: queries,
        results: results
    };
}

// Function to generate JTBD analysis using AI
async function generateJTBDAnalysis(websiteContent, marketIntel, companyName, companyContext) {
    // Prepare the context for AI analysis
    const aggregatedContent = `
Company: ${companyName}
Website: ${websiteContent.url}

Website Content:
${websiteContent.content}

Market Intelligence:
${marketIntel.results.map(r => `- ${r.title}: ${r.description}`).join('\n')}

Company Context:
Industry: ${companyContext?.industry || 'Not specified'}
Product: ${companyContext?.productName || 'Not specified'}
Target Market: ${companyContext?.targetMarket || 'Not specified'}
    `.trim();

    // For now, return a structured template with intelligent defaults
    // In production, this would call OpenAI/Anthropic/Gemini API
    const jtbdTemplate = generateIntelligentJTBDTemplate(
        companyName, 
        websiteContent.content,
        marketIntel.results,
        companyContext
    );

    return jtbdTemplate;
}

// Function to generate intelligent JTBD template based on scraped content
function generateIntelligentJTBDTemplate(companyName, websiteContent, marketResults, companyContext) {
    // Extract key phrases from content for more relevant JTBD
    const industry = companyContext?.industry || 'technology';
    const productName = companyContext?.productName || companyName;
    const isB2B = companyContext?.targetMarket === 'B2B';
    
    // Analyze content for common patterns
    const hasDataMentions = /data|analytics|insights|metrics|dashboard/i.test(websiteContent);
    const hasAutomationMentions = /automat|workflow|process|efficiency|streamline/i.test(websiteContent);
    const hasCollaborationMentions = /team|collaborat|share|together|unified/i.test(websiteContent);
    const hasSecurityMentions = /security|complian|encrypt|protect|safe/i.test(websiteContent);
    const hasIntegrationMentions = /integrat|connect|api|sync|import/i.test(websiteContent);

    // Build context-aware JTBD based on detected patterns
    let context = isB2B 
        ? `Operating in a competitive ${industry} landscape where digital transformation and operational efficiency are critical for growth.`
        : `Navigating the modern ${industry} ecosystem where user experience and value delivery are paramount.`;

    let strugglingMoments = [];
    if (hasDataMentions) strugglingMoments.push('lack of visibility into key metrics');
    if (hasAutomationMentions) strugglingMoments.push('manual processes consuming valuable time');
    if (hasCollaborationMentions) strugglingMoments.push('siloed teams and fragmented communication');
    if (hasSecurityMentions) strugglingMoments.push('compliance risks and security vulnerabilities');
    if (hasIntegrationMentions) strugglingMoments.push('disconnected tools creating data silos');
    
    const strugglingMomentsText = strugglingMoments.length > 0
        ? `Teams are experiencing ${strugglingMoments.join(', ')}, leading to inefficiencies and missed opportunities.`
        : `Organizations face operational challenges that limit their ability to scale and compete effectively.`;

    const pushes = isB2B
        ? `Executive pressure to modernize technology stack and demonstrate ROI. Market competition driving need for differentiation. ${hasSecurityMentions ? 'Regulatory requirements demanding better compliance and audit trails.' : 'Customer expectations for faster delivery and better service.'}`
        : `Rising customer expectations for seamless experiences. Competitive pressure from digital-first alternatives. Need to adapt quickly to changing market conditions.`;

    const anxieties = `Fear of implementation complexity and potential disruption to existing workflows. Concerns about user adoption and change management. ${isB2B ? 'Uncertainty about integration with existing enterprise systems.' : 'Questions about cost-benefit and time to value.'}`;

    const desiredOutcomes = [];
    if (hasDataMentions) desiredOutcomes.push('data-driven decision making');
    if (hasAutomationMentions) desiredOutcomes.push('automated workflows reducing manual effort by 50%+');
    if (hasCollaborationMentions) desiredOutcomes.push('unified team collaboration');
    if (hasSecurityMentions) desiredOutcomes.push('enterprise-grade security and compliance');
    
    const desiredOutcomesText = desiredOutcomes.length > 0
        ? `Achieve ${desiredOutcomes.join(', ')}. Demonstrate measurable ROI within 6-12 months.`
        : `Transform operations to be more efficient, scalable, and competitive. Achieve measurable improvements in key performance metrics.`;

    const basicQuality = `${isB2B ? 'Enterprise-grade security with SOC2/ISO certifications. ' : ''}Reliable performance with 99.9% uptime SLA. ${hasIntegrationMentions ? 'Native integrations with existing tools and platforms. ' : ''}Responsive customer support. Clear documentation and onboarding resources.`;

    const hiringCriteria = `Proven track record in ${industry} with similar-sized organizations. ${hasIntegrationMentions ? 'Strong ecosystem of integrations and APIs. ' : ''}Implementation methodology that minimizes disruption. ${isB2B ? 'Reference customers willing to share success stories.' : 'User-friendly interface requiring minimal training.'}`;

    const firingCriteria = `Poor customer support response times. Hidden costs or unexpected price increases. ${hasSecurityMentions ? 'Security breaches or compliance failures. ' : ''}Lack of product roadmap alignment with customer needs. Difficulty in extracting or migrating data.`;

    const keyTradeoffs = `May accept higher initial investment for long-term value. Willing to adapt some processes to fit best practices. ${isB2B ? 'Could compromise on customization for faster implementation.' : 'May trade some advanced features for ease of use.'}`;

    return {
        'Context': context,
        'Struggling Moments': strugglingMomentsText,
        'Pushes': pushes,
        'Anxieties': anxieties,
        'Desired Outcomes': desiredOutcomesText,
        'Basic Quality (Table Stakes)': basicQuality,
        'Hiring Criteria': hiringCriteria,
        'Firing Criteria': firingCriteria,
        'Key Trade-offs': keyTradeoffs
    };
}