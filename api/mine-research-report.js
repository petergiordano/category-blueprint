import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
// In Vercel, environment variables are automatically available.
// For local development, ensure GEMINI_API_KEY is set in .env.local
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please set it in your environment variables.');
  // In a real scenario, you might want to throw an error or return a 500 response here.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the JSON templates for each part of the application
// These match the actual import templates used by the application
const jsonTemplates = {
  'Segment Foundation': {
    "jobsToBeDone": {
      "Context": "",
      "Struggling Moments": "",
      "Pushes & Pulls": "",
      "Anxieties & Habits": "",
      "Desired Outcomes": "",
      "Basic Quality (Table Stakes)": "",
      "Hiring Criteria": "",
      "Firing Criteria": "",
      "Key Trade-offs": ""
    },
    "customerValue": {
      "Table Stakes": "",
      "Functional Value": "",
      "Ease of Doing Business": "",
      "Individual Value": "",
      "Aspirational Value": ""
    },
    "willingnessToPay": {
      "Ability to Pay": "",
      "Economic Justification": "",
      "Relative Value vs. Alternatives": "",
      "Risk & Switching Costs": "",
      "Market Reference Points": ""
    }
  },
  'ICP Definition': {
    "icpDefinition": {
      "quickDecisionMaking": "",
      "prioritizedRequirements": "",
      "implementationReadiness": "",
      "firmographic": "",
      "technographic": "",
      "behavioral": ""
    }
  },
  'Positioning': {
    "competitiveAlternatives": [
      {
        "alternative": "",
        "description": ""
      }
    ],
    "uniqueValueAndProof": [
      {
        "attributeName": "",
        "attributeDescription": "",
        "benefit": "",
        "value": ""
      }
    ],
    "marketCategory": "",
    "categoryName": "",
    "relevantTrends": {
      "trend1": "",
      "trend2": "",
      "trend3": "",
      "trend4": ""
    }
  },
  'Category Design': {
    "pointOfView": {
      "fromStatement": "",
      "toStatement": ""
    },
    "newOpportunity": "",
    "categoryNameAndDefinition": {
      "name": "",
      "definition": ""
    },
    "manifesto": "",
    "marketCategory": "",
    "targetMarketCharacteristics": {
      "summary": "",
      "firmographic": "",
      "technographic": "",
      "behavioral": "",
      "implementationReadiness": ""
    }
  }
};

// Master prompt function for the LLM
const masterPrompt = (reportText, jsonSchema, partName) => {
  return `You are an expert market research analyst and positioning strategist. Your task is to extract relevant information from a comprehensive research report and populate a specific JSON structure for the "${partName}" section.

  **Critical Instructions:**
  1. ANALYZE the entire research report to understand the company, product, market context, and customer insights.
  2. EXTRACT relevant information specifically for the "${partName}" section from the report.
  3. LOOK FOR "Synthesis" statements and supporting "Evidence" in the report - these contain the key insights.
  4. For each field in the JSON schema, provide CONCISE, ACTIONABLE content (1-3 sentences max per field).
  5. If specific information is not found in the report, leave the field as an empty string (""). DO NOT invent information.
  6. For array fields (like competitiveAlternatives, uniqueValueAndProof), extract multiple items when available.
  7. Your output MUST be ONLY valid JSON - no markdown, no comments, no additional text.

  **Context About This Section:**
  ${getPartContext(partName)}

  **Research Report:**
  \`\`\`
  ${reportText}
  \`\`\`

  **Target JSON Schema:**
  \`\`\`json
  ${JSON.stringify(jsonSchema, null, 2)}
  \`\`\`

  **Your JSON Output (valid JSON only):**
  `;
};

// Helper function to provide context about each part
const getPartContext = (partName) => {
  switch (partName) {
    case 'Segment Foundation':
      return 'This section focuses on Jobs-to-be-Done (JTBD), Customer Value propositions, and Willingness to Pay factors. Look for information about customer context, pain points, desired outcomes, and economic justification.';
    case 'ICP Definition':
      return 'This section defines the Ideal Customer Profile (ICP). Look for firmographic (company characteristics), technographic (technology stack), and behavioral attributes of ideal customers.';
    case 'Positioning':
      return 'This section covers competitive positioning. Look for competitive alternatives, unique value propositions, market category information, and relevant market trends.';
    case 'Category Design':
      return 'This section focuses on category creation and narrative. Look for point of view statements (from/to), new opportunities, category definitions, and market messaging.';
    default:
      return 'Extract relevant information for this business framework section.';
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { reportText } = req.body;

  if (!reportText) {
    return res.status(400).json({ message: 'Missing reportText in request body.' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ message: 'Server configuration error: GEMINI_API_KEY is not set.' });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro for text generation

  const results = {};
  const errors = [];

  // Process each part with retry logic
  for (const partName in jsonTemplates) {
    const schema = jsonTemplates[partName];
    const prompt = masterPrompt(reportText, schema, partName);

    let success = false;
    let attempt = 0;
    const maxRetries = 3;

    while (!success && attempt < maxRetries) {
      attempt++;
      try {
        console.log(`Processing ${partName}, attempt ${attempt}/${maxRetries}`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let extractedJsonString = response.text();

        // Enhanced JSON cleaning - handle various LLM response formats
        extractedJsonString = extractedJsonString
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[^{]*/g, '') // Remove everything before first {
          .replace(/[^}]*$/g, '') // Remove everything after last }
          .trim();

        // Additional cleanup for common LLM artifacts
        if (extractedJsonString.includes('**Your JSON Output:**')) {
          extractedJsonString = extractedJsonString.split('**Your JSON Output:**')[1].trim();
        }

        const parsedJson = JSON.parse(extractedJsonString);

        // Validate that the parsed JSON has the expected structure
        if (validateJsonStructure(parsedJson, schema)) {
          results[partName] = {
            content: parsedJson,
            metadata: {
              processedAt: new Date().toISOString(),
              attempts: attempt,
              partName: partName
            }
          };
          success = true;
          console.log(`Successfully processed ${partName} on attempt ${attempt}`);
        } else {
          throw new Error('JSON structure validation failed');
        }

      } catch (error) {
        console.error(`Error processing part "${partName}" on attempt ${attempt}:`, error.message);

        if (attempt === maxRetries) {
          errors.push({
            part: partName,
            message: error.message,
            attempts: attempt
          });
          results[partName] = {
            error: `Failed to process after ${maxRetries} attempts: ${error.message}`,
            metadata: {
              processedAt: new Date().toISOString(),
              attempts: attempt,
              partName: partName
            }
          };
        } else {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }

  // Helper function to validate JSON structure
  function validateJsonStructure(data, schema) {
    try {
      // Basic validation - ensure it's an object and has some expected keys
      if (typeof data !== 'object' || data === null) return false;

      // For arrays in schema, don't require exact match but ensure structure is reasonable
      for (const key in schema) {
        if (Array.isArray(schema[key]) && data[key] && !Array.isArray(data[key])) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Prepare final response with processing summary
  const successfulParts = Object.keys(results).filter(part => !results[part].error);
  const failedParts = Object.keys(results).filter(part => results[part].error);

  const response = {
    success: failedParts.length === 0,
    message: failedParts.length === 0
      ? `Successfully processed all ${successfulParts.length} parts`
      : `Processed ${successfulParts.length}/${Object.keys(jsonTemplates).length} parts successfully`,
    results,
    summary: {
      total: Object.keys(jsonTemplates).length,
      successful: successfulParts.length,
      failed: failedParts.length,
      processedAt: new Date().toISOString()
    }
  };

  if (errors.length > 0) {
    response.errors = errors;
    return res.status(207).json(response); // 207 Multi-Status for partial success
  }

  return res.status(200).json(response);
}
