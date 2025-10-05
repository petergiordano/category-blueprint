import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'GEMINI_API_KEY not configured',
                details: 'Environment variable missing'
            });
        }

        console.log('Initializing Gemini AI with API key:', apiKey.substring(0, 10) + '...');
        const genAI = new GoogleGenerativeAI(apiKey);

        // Try to list models using the SDK
        let models = [];
        let sdkError = null;

        try {
            // The SDK might have a listModels method
            if (typeof genAI.listModels === 'function') {
                const response = await genAI.listModels();
                models = response;
            }
        } catch (err) {
            sdkError = err.message;
            console.log('SDK listModels error:', err);
        }

        // Try direct API call as fallback
        let directApiModels = null;
        let directApiError = null;

        try {
            const apiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            );

            if (apiResponse.ok) {
                directApiModels = await apiResponse.json();
            } else {
                directApiError = `${apiResponse.status} ${apiResponse.statusText}`;
            }
        } catch (err) {
            directApiError = err.message;
        }

        // Try v1 API (non-beta)
        let v1ApiModels = null;
        let v1ApiError = null;

        try {
            const v1Response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
            );

            if (v1Response.ok) {
                v1ApiModels = await v1Response.json();
            } else {
                v1ApiError = `${v1Response.status} ${v1Response.statusText}`;
            }
        } catch (err) {
            v1ApiError = err.message;
        }

        return res.status(200).json({
            success: true,
            sdkPackageVersion: '@google/generative-ai',
            results: {
                sdkListModels: {
                    models: models,
                    error: sdkError
                },
                v1betaDirectApi: {
                    models: directApiModels,
                    error: directApiError,
                    url: 'https://generativelanguage.googleapis.com/v1beta/models'
                },
                v1DirectApi: {
                    models: v1ApiModels,
                    error: v1ApiError,
                    url: 'https://generativelanguage.googleapis.com/v1/models'
                }
            }
        });

    } catch (error) {
        console.error('List models error:', error);
        return res.status(500).json({
            error: 'Failed to list models',
            message: error.message,
            stack: error.stack
        });
    }
}
