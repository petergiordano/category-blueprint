# Web Search API Research & Architecture Decision

**Date**: 2025-08-28  
**Purpose**: Research and architecture planning for F-5 and F-6 implementation  
**Status**: Phase 2A Complete - Architecture Decision Made

## Research Summary

### Web Search API Options Evaluated

#### 1. Brave Search API (Recommended)
**Capabilities:**
- Independent index of 30+ billion pages
- Multiple endpoints: web, images, videos, news, suggestions, spellcheck
- AI-powered search and RAG pipeline support
- Up to 5 contextual snippets per result
- Schema-enriched results

**Pricing:**
- Free Plan: 2,000 queries/month, 1 query/second ($0)
- Base AI Plan: $5 per 1,000 requests, 20 queries/second
- Pro AI Plan: $9 per 1,000 requests, 50 queries/second, unlimited

**Advantages:**
- Independent index (not Google-dependent)
- Privacy-focused
- Competitive pricing
- AI-optimized features
- Available via MCP server (already integrated)

**Limitations:**
- Requires credit card even for free tier
- Newer service with smaller index than Google

#### 2. SerpAPI
**Capabilities:**
- Google Search results scraping
- Multiple search engines supported
- Structured JSON responses

**Pricing:**
- $50/month for 5,000 searches
- $0.01 per search at scale

**Advantages:**
- Mature service
- Google-quality results
- Well-documented

**Limitations:**
- More expensive than alternatives
- Dependent on Google's index
- Legal gray area (web scraping)

#### 3. Serper.dev
**Capabilities:**
- Google Search API alternative
- Fast response times
- Clean JSON responses

**Pricing:**
- $50/month for 10,000 searches
- $0.005 per search

**Advantages:**
- Cost-effective
- Fast performance
- Simple integration

**Limitations:**
- Smaller company/less established
- Google dependency

#### 4. Google Custom Search Engine (CSE)
**Capabilities:**
- Official Google API
- 10 billion web pages indexed
- Customizable search experience

**Pricing:**
- 100 queries/day free
- $5 per 1,000 queries after

**Advantages:**
- Official Google service
- Comprehensive results
- Reliable

**Limitations:**
- Low free quota (100/day)
- More expensive at scale
- Requires Google Cloud setup

## CORS Analysis

**Key Finding**: **Client-side integration is not feasible** for web search APIs due to CORS restrictions.

**Technical Details:**
- Web search APIs do not set CORS headers allowing browser requests
- Browser same-origin policy blocks direct API calls from web pages
- API keys exposed in client-side code create security vulnerabilities
- All major search APIs require server-side integration

**Evidence:**
- Brave Search API documentation shows server-side examples only
- StackOverflow discussions confirm CORS limitations for external APIs
- MDN documentation explains browser CORS enforcement

## Serverless Function Research

### Vercel Functions (Recommended)
**Capabilities:**
- Server-side code execution without server management
- Automatic scaling based on demand
- CORS header control
- Integration with static sites
- Edge Network routing

**Deployment:**
- Minimal configuration required
- Automatic optimization for chosen frameworks
- Built-in observability and metrics
- Supports multiple runtime environments

**Pricing:**
- Based on CPU time, memory, and invocations
- Generous free tier for development

### Netlify Functions (Alternative)
**Capabilities:**
- AWS Lambda wrapper
- CORS configuration support
- Simple deployment from Git

**Advantages:**
- User-friendly interface
- Good documentation for CORS handling
- Integrated with static site hosting

**Limitations:**
- Less flexible than Vercel for this use case
- Slower cold start times

## Architecture Decision

### Chosen Architecture: **Hybrid Single-File + Serverless Proxy**

**Core Principle**: Maintain the project's single-file simplicity while adding minimal serverless infrastructure only where necessary.

### Implementation Strategy

#### 1. Single-File Architecture Preservation
- Keep `index.html` as the primary application file
- All UI components and state management remain client-side
- No build process or complex deployment pipeline

#### 2. Serverless API Proxy
- **Platform**: Vercel Functions
- **Purpose**: CORS-enabled proxy for web search APIs
- **Deployment**: Simple `/api/search.js` function file
- **Security**: API keys stored in Vercel environment variables

#### 3. API Selection
- **Primary**: Brave Search API (via MCP server for development, serverless for production)
- **Rationale**: Independent index, AI-optimized, competitive pricing, privacy-focused

### Technical Implementation Plan

#### Serverless Function Structure
```
/api/
  search.js         # Web search proxy function
  uniqueness.js     # F-5 specific endpoint (optional)
  trends.js         # F-6 specific endpoint (optional)
```

#### Client-Side Integration
- Fetch API calls to `/api/search` instead of external APIs
- Same error handling and loading states as simulated AI features
- Graceful degradation when API is unavailable

#### Deployment Approach
1. **Development**: Use MCP Brave Search server (already available)
2. **Production**: Deploy serverless functions to Vercel
3. **Fallback**: Graceful error messages when API unavailable

### Cost Analysis

**Expected Usage**:
- F-5 (Uniqueness): ~10 queries per user session
- F-6 (Trends): ~4 queries per user session
- Estimated: 100 user sessions/month = 1,400 queries/month

**Cost with Brave Search API**:
- Free tier covers up to 2,000 queries/month
- **Estimated monthly cost**: $0 (within free tier)
- **Scale cost**: $5 per 1,000 additional queries

**Vercel Functions Cost**:
- Free tier: 100GB-hours compute, 1M invocations/month
- **Estimated monthly cost**: $0 (within free tier)

**Total Expected Cost**: $0/month for initial deployment

## Risk Mitigation Strategies

### 1. API Failure Handling
- Graceful degradation with user-friendly error messages
- Retry logic for transient failures
- Fallback to "Analysis unavailable - please try again later"

### 2. Rate Limiting
- Client-side request debouncing (prevent rapid clicking)
- Server-side rate limiting in proxy function
- User feedback for rate limit exceeded

### 3. Security
- API keys stored in environment variables only
- No sensitive data logged or cached
- Input sanitization in proxy functions

### 4. Performance
- Response caching (5-minute TTL for similar queries)
- Async/await patterns to avoid blocking UI
- Loading indicators for user feedback

## Implementation Phases

### Phase 2B: F-5 Implementation (Next)
1. Create Vercel Functions setup
2. Implement Brave Search API proxy
3. Build F-5 "Analyze Uniqueness" feature
4. Test and validate uniqueness scoring

### Phase 2C: F-6 Implementation (Final)
1. Extend API proxy for trend-specific searches
2. Build F-6 "Analyze Trend" feature
3. Implement evidence extraction and formatting
4. Final integration testing

## Success Criteria Met

✅ **API Selection**: Brave Search API chosen (independent, AI-optimized, cost-effective)  
✅ **Architecture Decision**: Hybrid single-file + minimal serverless proxy  
✅ **CORS Solution**: Serverless functions provide CORS-enabled API proxy  
✅ **Cost Management**: Expected $0/month within free tiers  
✅ **Risk Mitigation**: Comprehensive fallback and error handling strategy  
✅ **Deployment Simplicity**: Maintains single-file paradigm with minimal infrastructure  

**Status**: Ready to proceed with Phase 2B (F-5 Implementation)

---

**Next Action**: Begin F-5 (Uniqueness Attribute Validation) implementation using Vercel Functions proxy architecture.