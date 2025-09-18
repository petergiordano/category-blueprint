import { jest } from '@jest/globals';
import handler from '../../api/mine-research-report';

// Mock the GoogleGenerativeAI and its methods
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(async (prompt) => {
        // Simulate different responses based on prompt content or partName
        const partNameMatch = prompt.match(/Target JSON Schema:\n```json\n\s*"(.*?)":/);
        const partName = partNameMatch ? partNameMatch[1] : 'unknown';

        let mockResponse = {};
        switch (partName) {
          case 'jobsToBeDone':
            mockResponse = {
              "Context": "Mock context about customer situation",
              "Struggling Moments": "Mock struggling moments",
              "Pushes & Pulls": "Mock pushes and pulls",
              "Anxieties & Habits": "Mock anxieties and habits",
              "Desired Outcomes": "Mock desired outcomes",
              "Basic Quality (Table Stakes)": "Mock table stakes",
              "Hiring Criteria": "Mock hiring criteria",
              "Firing Criteria": "Mock firing criteria",
              "Key Trade-offs": "Mock trade-offs"
            };
            break;
          case 'customerValue':
            mockResponse = {
              "Table Stakes": "Mock table stakes value",
              "Functional Value": "Mock functional value",
              "Ease of Doing Business": "Mock ease of doing business",
              "Individual Value": "Mock individual value",
              "Aspirational Value": "Mock aspirational value"
            };
            break;
          case 'willingnessToPay':
            mockResponse = {
              "Ability to Pay": "Mock ability to pay",
              "Economic Justification": "Mock economic justification",
              "Relative Value vs. Alternatives": "Mock relative value",
              "Risk & Switching Costs": "Mock risk and switching costs",
              "Market Reference Points": "Mock market reference points"
            };
            break;
          case 'icpDefinition':
            mockResponse = {
              "quickDecisionMaking": "Mock quick decision making",
              "prioritizedRequirements": "Mock prioritized requirements",
              "implementationReadiness": "Mock implementation readiness",
              "firmographic": "Mock firmographic",
              "technographic": "Mock technographic",
              "behavioral": "Mock behavioral"
            };
            break;
          case 'competitiveAlternatives':
            mockResponse = [
              {
                "alternative": "Mock Alternative 1",
                "description": "Mock description 1"
              },
              {
                "alternative": "Mock Alternative 2",
                "description": "Mock description 2"
              }
            ];
            break;
          case 'uniqueValueAndProof':
            mockResponse = [
              {
                "attributeName": "Mock Attribute 1",
                "attributeDescription": "Mock attribute description 1",
                "benefit": "Mock benefit 1",
                "value": "Mock value 1"
              },
              {
                "attributeName": "Mock Attribute 2",
                "attributeDescription": "Mock attribute description 2",
                "benefit": "Mock benefit 2",
                "value": "Mock value 2"
              }
            ];
            break;
          case 'pointOfView':
            mockResponse = {
              "fromStatement": "Mock from statement",
              "toStatement": "Mock to statement"
            };
            break;
          default:
            mockResponse = { defaultField: 'Mock Default Value' };
        }

        return {
          response: Promise.resolve({
            text: () => `
```json
${JSON.stringify(mockResponse)}
``` `,
          }),
        };
      }),
    })),
  })),
}));

describe('mine-research-report API', () => {
  // Set up a mock for process.env.GEMINI_API_KEY
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, GEMINI_API_KEY: 'mock-api-key' };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 405 for non-POST requests', async () => {
    const req = { method: 'GET' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('should return 400 if reportText is missing', async () => {
    const req = { method: 'POST', body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing reportText in request body.' });
  });

  it('should return 500 if GEMINI_API_KEY is not set', async () => {
    process.env.GEMINI_API_KEY = undefined; // Unset the key for this test
    const req = { method: 'POST', body: { reportText: 'sample report' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server configuration error: GEMINI_API_KEY is not set.' });
  });

  it('should successfully process a report and return structured JSON for all parts', async () => {
    const req = { method: 'POST', body: { reportText: 'This is a sample research report about a new market segment.' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const responseData = res.json.mock.calls[0][0];

    // Check overall response structure
    expect(responseData).toHaveProperty('success', true);
    expect(responseData).toHaveProperty('message');
    expect(responseData).toHaveProperty('results');
    expect(responseData).toHaveProperty('summary');

    // Check that all parts are present in results
    expect(responseData.results).toHaveProperty('Segment Foundation');
    expect(responseData.results).toHaveProperty('ICP Definition');
    expect(responseData.results).toHaveProperty('Positioning');
    expect(responseData.results).toHaveProperty('Category Design');

    // Check individual part structure
    const segmentFoundation = responseData.results['Segment Foundation'];
    expect(segmentFoundation).toHaveProperty('content');
    expect(segmentFoundation).toHaveProperty('metadata');
    expect(segmentFoundation.metadata).toHaveProperty('processedAt');
    expect(segmentFoundation.metadata).toHaveProperty('attempts');
    expect(segmentFoundation.metadata).toHaveProperty('partName', 'Segment Foundation');
  });

  it('should handle API errors gracefully with retry logic', async () => {
    // Mock the Gemini API to fail initially then succeed
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockGenAI = GoogleGenerativeAI.mock.results[0].value;
    const mockModel = mockGenAI.getGenerativeModel.mock.results[0].value;

    let callCount = 0;
    mockModel.generateContent.mockImplementation(async () => {
      callCount++;
      if (callCount <= 2) {
        throw new Error('API temporarily unavailable');
      }
      return {
        response: Promise.resolve({
          text: () => '```json\n{"Context": "Mock context"}\n```'
        })
      };
    });

    const req = { method: 'POST', body: { reportText: 'test report' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    // Should eventually succeed after retries
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(true);
    expect(callCount).toBeGreaterThan(2); // Confirms retry logic was used
  });

  it('should return partial success when some parts fail', async () => {
    // Mock to simulate one part failing after max retries
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockGenAI = GoogleGenerativeAI.mock.results[0].value;
    const mockModel = mockGenAI.getGenerativeModel.mock.results[0].value;

    mockModel.generateContent.mockImplementation(async (prompt) => {
      if (prompt.includes('Segment Foundation')) {
        throw new Error('Persistent failure for Segment Foundation');
      }
      return {
        response: Promise.resolve({
          text: () => '```json\n{"defaultField": "Mock value"}\n```'
        })
      };
    });

    const req = { method: 'POST', body: { reportText: 'test report' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(207); // Multi-Status for partial success

    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(false);
    expect(responseData.summary.failed).toBeGreaterThan(0);
    expect(responseData.summary.successful).toBeGreaterThan(0);
    expect(responseData.errors).toBeDefined();
  });

  it('should validate JSON structure and reject invalid responses', async () => {
    // Mock to return invalid JSON
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockGenAI = GoogleGenerativeAI.mock.results[0].value;
    const mockModel = mockGenAI.getGenerativeModel.mock.results[0].value;

    mockModel.generateContent.mockImplementation(async () => ({
      response: Promise.resolve({
        text: () => 'This is not valid JSON'
      })
    }));

    const req = { method: 'POST', body: { reportText: 'test report' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(207); // Partial success due to failures

    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(false);
    expect(responseData.summary.failed).toBe(4); // All 4 parts should fail
  });

  it('should clean and parse JSON responses with various LLM artifacts', async () => {
    // Mock to return JSON with markdown artifacts
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockGenAI = GoogleGenerativeAI.mock.results[0].value;
    const mockModel = mockGenAI.getGenerativeModel.mock.results[0].value;

    mockModel.generateContent.mockImplementation(async () => ({
      response: Promise.resolve({
        text: () => `
        Here's the extracted JSON:
        \`\`\`json
        {"Context": "Cleaned context value"}
        \`\`\`
        This completes the extraction.
        `
      })
    }));

    const req = { method: 'POST', body: { reportText: 'test report' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(true);
  });

  it('should handle empty report text gracefully', async () => {
    const req = { method: 'POST', body: { reportText: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing reportText in request body.' });
  });

  it('should include processing metadata in successful responses', async () => {
    const req = { method: 'POST', body: { reportText: 'Valid research report content' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    const responseData = res.json.mock.calls[0][0];

    expect(responseData.summary).toBeDefined();
    expect(responseData.summary).toHaveProperty('total', 4);
    expect(responseData.summary).toHaveProperty('successful');
    expect(responseData.summary).toHaveProperty('failed');
    expect(responseData.summary).toHaveProperty('processedAt');

    // Check that processedAt is a valid ISO string
    expect(new Date(responseData.summary.processedAt).toISOString()).toBe(responseData.summary.processedAt);
  });
});
